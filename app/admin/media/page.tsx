'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload, Trash2, Copy, Check, Search, ExternalLink, FileImage,
  HardDrive, AlertTriangle, Link2Off, Package, FolderKanban, ImageIcon,
  LayoutTemplate, Factory, BadgeCheck, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  getMediaLibraryReport, deleteStorageAsset, uploadFile,
  CONTENT_BUCKETS, type ContentBucketId, type StorageAsset, type MediaLibraryReport, type AssetUsage
} from '@/lib/db/services';
import { cn } from '@/lib/utils';

type Filter = 'ALL' | ContentBucketId | 'UNUSED';

const USAGE_ICON: Record<AssetUsage['kind'], React.ComponentType<{ className?: string }>> = {
  product: Package, category: FolderKanban, gallery: ImageIcon,
  homepage: LayoutTemplate, industry: Factory, logo: BadgeCheck,
};

function formatBytes(n: number | null | undefined) {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function bucketLabel(id: string) {
  return CONTENT_BUCKETS.find((b) => b.id === id)?.label ?? id;
}

export default function AdminMediaLibraryPage() {
  const [report, setReport] = React.useState<MediaLibraryReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<Filter>('ALL');
  const [search, setSearch] = React.useState('');
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const [showUpload, setShowUpload] = React.useState(false);
  const [uploadBucket, setUploadBucket] = React.useState<ContentBucketId>('media');
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      setReport(await getMediaLibraryReport());
    } catch {
      toast.error('Could not read media storage');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    getMediaLibraryReport()
      .then((r) => { if (active) setReport(r); })
      .catch(() => { if (active) toast.error('Could not read media storage'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const assets = report?.assets ?? [];
  const unusedCount = assets.filter((a) => a.usages.length === 0).length;
  const totalBytes = assets.reduce((n, a) => n + (a.size_bytes || 0), 0);
  const embedded = (report?.externalRefs ?? []).filter((r) => r.kind === 'embedded');
  const localRefs = (report?.externalRefs ?? []).filter((r) => r.kind === 'local');

  const visible = assets.filter((a) => {
    if (filter === 'UNUSED' && a.usages.length > 0) return false;
    if (filter !== 'ALL' && filter !== 'UNUSED' && a.bucket !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return a.path.toLowerCase().includes(q) || a.usages.some((u) => u.label.toLowerCase().includes(q));
  });

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied');
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  const remove = async (a: StorageAsset) => {
    const inUse = a.usages.length > 0;
    const msg = inUse
      ? `"${a.path}" is used by ${a.usages.length} item(s):\n\n${a.usages.map((u) => `• ${u.label}`).join('\n')}\n\nDeleting it will break those images. Continue?`
      : `Delete "${a.path}" from ${bucketLabel(a.bucket)} storage? This cannot be undone.`;
    if (!confirm(msg)) return;
    const ok = await deleteStorageAsset(a.bucket, a.path);
    if (ok) {
      toast.success('File deleted');
      setReport((r) => r && { ...r, assets: r.assets.filter((x) => x.url !== a.url) });
    } else {
      toast.error('Delete failed — you may not have admin permission on storage');
    }
  };

  const submitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) { toast.error('Choose at least one image'); return; }
    setUploading(true);
    let done = 0;
    for (const f of uploadFiles) {
      try {
        await uploadFile(f, uploadBucket);
        done++;
      } catch (err: any) {
        toast.error(err?.message || `Failed to upload ${f.name}`);
      }
    }
    setUploading(false);
    if (done > 0) {
      toast.success(`${done} file(s) uploaded to ${bucketLabel(uploadBucket)}`);
      setShowUpload(false);
      setUploadFiles([]);
      refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal">Media Library</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Every uploaded image, and where each one is used on the site.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading} className="h-11">
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} /> Refresh
          </Button>
          <Button onClick={() => setShowUpload(true)} className="bg-brand-green hover:bg-emerald-700 text-white font-bold h-11 px-6">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!loading && report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={HardDrive} label="Files in storage" value={String(assets.length)} sub={formatBytes(totalBytes)} />
          <Stat icon={Link2Off} label="Unused files" value={String(unusedCount)} sub="not referenced anywhere"
                tone={unusedCount > 0 ? 'warn' : 'ok'} onClick={() => setFilter('UNUSED')} />
          <Stat icon={FileImage} label="Bundled artwork" value={String(localRefs.length)} sub="from /public/images" />
          <Stat icon={AlertTriangle} label="Embedded blobs" value={String(embedded.length)}
                sub={embedded.length > 0 ? 'base64 stored in rows' : 'none — good'} tone={embedded.length > 0 ? 'bad' : 'ok'} />
        </div>
      )}

      {/* Warnings that actually matter */}
      {!loading && report && report.bucketErrors.length > 0 && (
        <Notice tone="bad" title="Some buckets could not be read">
          {report.bucketErrors.map((e) => (
            <div key={e.bucket}><code className="font-mono">{e.bucket}</code>: {e.message}</div>
          ))}
          <div className="mt-1">Run the storage section of <code className="font-mono">database-migrations.sql</code> to create missing buckets.</div>
        </Notice>
      )}
      {!loading && embedded.length > 0 && (
        <Notice tone="bad" title={`${embedded.length} image(s) are stored as base64 inside database rows`}>
          These were saved when a storage upload failed silently. They bloat every product query and never show up here.
          Re-upload the image on the affected item to replace it:
          <ul className="mt-1 space-y-0.5">
            {embedded.slice(0, 8).map((r, i) => (
              <li key={i}>• {r.usages.map((u) => u.label).join(', ')} <span className="text-muted-foreground">({formatBytes(Math.round(r.url.length * 0.75))})</span></li>
            ))}
            {embedded.length > 8 && <li>…and {embedded.length - 8} more</li>}
          </ul>
        </Notice>
      )}

      {/* Filters */}
      <div className="bg-white border border-border rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {([['ALL', 'All'], ...CONTENT_BUCKETS.map((b) => [b.id, b.label]), ['UNUSED', 'Unused']] as [Filter, string][]).map(([id, label]) => {
            const n = id === 'ALL' ? assets.length : id === 'UNUSED' ? unusedCount : assets.filter((a) => a.bucket === id).length;
            return (
              <button key={id} onClick={() => setFilter(id)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all',
                  filter === id ? 'bg-brand-green text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
                {label} <span className={cn('ml-1 opacity-70', filter === id && 'opacity-90')}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search filename or item…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Reading media storage…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <FileImage className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">
            {assets.length === 0 ? 'Nothing in storage yet' : 'No files match this filter'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {assets.length === 0
              ? 'Your catalogue currently uses the bundled SVG artwork from /public/images. Real photos you upload on Products, Categories, Gallery or Homepage will appear here.'
              : 'Try another bucket or clear the search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visible.map((a) => (
            <div key={a.url} className={cn('group bg-white border rounded-2xl overflow-hidden shadow-xs flex flex-col',
              a.usages.length === 0 ? 'border-amber-200' : 'border-border')}>
              <div className="relative aspect-square bg-slate-100">
                <Image src={a.url} alt={a.path} fill className="object-cover" unoptimized={a.mime_type === 'image/svg+xml'} />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-200">
                  {bucketLabel(a.bucket)}
                </span>
                {a.usages.length === 0 && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Unused
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-charcoal truncate" title={a.path}>{a.path}</p>
                  <p className="text-[10px] text-muted-foreground">{formatBytes(a.size_bytes)}{a.mime_type ? ` · ${a.mime_type.replace('image/', '')}` : ''}</p>
                </div>
                <div className="flex flex-wrap gap-1 flex-1 content-start">
                  {a.usages.slice(0, 3).map((u, i) => {
                    const Icon = USAGE_ICON[u.kind];
                    return (
                      <Link key={i} href={u.href} title={u.label}
                        className="inline-flex items-center gap-1 max-w-full text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100">
                        <Icon className="h-3 w-3 shrink-0" /><span className="truncate">{u.label}</span>
                      </Link>
                    );
                  })}
                  {a.usages.length > 3 && <span className="text-[10px] text-muted-foreground">+{a.usages.length - 3} more</span>}
                </div>
                <div className="flex items-center gap-1 pt-1 border-t border-border">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => copy(a.url)}>
                    {copiedUrl === a.url ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" asChild>
                    <a href={a.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a>
                  </Button>
                  <div className="flex-1" />
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => remove(a)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Upload Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitUpload} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Bucket</Label>
              <Select value={uploadBucket} onValueChange={(v) => setUploadBucket(v as ContentBucketId)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_BUCKETS.map((b) => <SelectItem key={b.id} value={b.id}>{b.label} <span className="text-muted-foreground">({b.id})</span></SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Images</Label>
              <Input type="file" accept="image/*" multiple onChange={(e) => setUploadFiles(Array.from(e.target.files || []))} />
              {uploadFiles.length > 0 && <p className="text-muted-foreground">{uploadFiles.length} file(s) · {formatBytes(uploadFiles.reduce((n, f) => n + f.size, 0))}</p>}
            </div>
            <p className="text-muted-foreground">
              To attach an image to a product, category or gallery item, upload it from that item&apos;s edit form instead — it will still appear here.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button type="submit" disabled={uploading} className="bg-brand-green text-white">{uploading ? 'Uploading…' : 'Upload'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, tone = 'neutral', onClick }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string;
  tone?: 'neutral' | 'ok' | 'warn' | 'bad'; onClick?: () => void;
}) {
  const tones = { neutral: 'text-slate-600 bg-slate-100', ok: 'text-emerald-700 bg-emerald-50', warn: 'text-amber-700 bg-amber-50', bad: 'text-red-700 bg-red-50' };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={cn('bg-white border border-border rounded-2xl p-4 flex items-center gap-3 text-left shadow-xs', onClick && 'hover:border-brand-green transition-colors')}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', tones[tone])}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
        <p className="text-xl font-bold text-brand-charcoal leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground truncate">{sub}</p>}
      </div>
    </Tag>
  );
}

function Notice({ tone, title, children }: { tone: 'warn' | 'bad'; title: string; children: React.ReactNode }) {
  const cls = tone === 'bad' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900';
  return (
    <div className={cn('border rounded-xl p-4 text-xs space-y-1', cls)}>
      <p className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {title}</p>
      <div className="pl-6">{children}</div>
    </div>
  );
}
