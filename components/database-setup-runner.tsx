'use client';

import * as React from 'react';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { provisionStorageAndSchema, ProvisionLog } from '@/lib/db/services';

const FULL_SQL_SCRIPT = `-- ==============================================================================
-- MS TRADERS MASTER STORAGE & SCHEMA PROVISIONING SCRIPT
-- Copy and paste this script directly into your database SQL editor
-- ==============================================================================

-- 1. CREATE / SYNCHRONIZE MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  title TEXT,
  file_url TEXT,
  url TEXT,
  file_size BIGINT,
  size_bytes BIGINT,
  mime_type TEXT,
  category TEXT DEFAULT 'General',
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all compatible columns exist
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS size_bytes BIGINT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Synchronize alias columns
UPDATE public.media SET title = name WHERE title IS NULL AND name IS NOT NULL;
UPDATE public.media SET name = title WHERE name IS NULL AND title IS NOT NULL;
UPDATE public.media SET url = file_url WHERE url IS NULL AND file_url IS NOT NULL;
UPDATE public.media SET file_url = url WHERE file_url IS NULL AND url IS NOT NULL;
UPDATE public.media SET size_bytes = file_size WHERE size_bytes IS NULL AND file_size IS NOT NULL;
UPDATE public.media SET file_size = size_bytes WHERE file_size IS NULL AND size_bytes IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view media" ON public.media;
CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public full access to media" ON public.media;
CREATE POLICY "Public full access to media" ON public.media FOR ALL USING (true);

-- 2. CREATE HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  primary_cta_text TEXT,
  primary_cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  enabled BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view homepage sections" ON public.homepage_sections;
CREATE POLICY "Public can view homepage sections" ON public.homepage_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public full access to homepage sections" ON public.homepage_sections;
CREATE POLICY "Public full access to homepage sections" ON public.homepage_sections FOR ALL USING (true);

-- 3. CREATE ALL APPLICATION STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES 
  ('media', 'media', true, 10485760),
  ('attachments', 'attachments', true, 10485760),
  ('hero-images', 'hero-images', true, 10485760),
  ('product-images', 'product-images', true, 10485760),
  ('category-images', 'category-images', true, 10485760),
  ('gallery-images', 'gallery-images', true, 10485760),
  ('quote-attachments', 'quote-attachments', true, 10485760),
  ('settings-assets', 'settings-assets', true, 10485760)
ON CONFLICT (id) DO UPDATE SET public = true;

UPDATE storage.buckets 
SET public = true 
WHERE id IN (
  'media', 'attachments', 'hero-images', 'product-images',
  'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'
);

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. STORAGE ACCESS POLICIES
DROP POLICY IF EXISTS "Public Access on All Buckets" ON storage.objects;
CREATE POLICY "Public Access on All Buckets" ON storage.objects
  FOR ALL USING (
    bucket_id IN (
      'media', 'attachments', 'hero-images', 'product-images', 
      'category-images', 'gallery-images', 'quote-attachments', 'settings-assets'
    )
  );
`;

export function DatabaseSetupRunner() {
  const [running, setRunning] = React.useState(false);
  const [logs, setLogs] = React.useState<ProvisionLog[]>([]);
  const [showSqlCode, setShowSqlCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleRunProvisioning = async () => {
    setRunning(true);
    setLogs([]);
    try {
      const result = await provisionStorageAndSchema();
      setLogs(result.logs);
      toast.success('Storage & schema provisioning finished!');
    } catch (err: any) {
      toast.error(`Provisioning error: ${err?.message || err}`);
    } finally {
      setRunning(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(FULL_SQL_SCRIPT);
    setCopied(true);
    toast.success('SQL script copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading text-lg font-bold text-white">
              Storage & Schema Provisioning Tool
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
              1-Click Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automatically initialize storage buckets (<code className="text-emerald-300">hero-images</code>, <code className="text-emerald-300">product-images</code>, <code className="text-emerald-300">media</code>, etc.) and repair table schema permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleRunProvisioning}
            disabled={running}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-9 px-4 shadow-md transition-all"
          >
            {running ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Provisioning...
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-4 w-4 fill-slate-950" />
                Run Provisioning Script
              </>
            )}
          </Button>

          <Button
            onClick={handleCopySql}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-slate-200 text-xs h-9 px-3"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4 text-emerald-400" />
                Copied SQL!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                Copy SQL Script
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Action logs terminal output */}
      {logs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Provisioning Console Output
            </span>
            <span>{logs.length} Operations Logged</span>
          </div>
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 leading-relaxed">
              {log.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
              {log.status === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />}
              {log.status === 'info' && <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <span className="text-slate-400 font-bold mr-2">[{log.step}]</span>
                <span className={log.status === 'success' ? 'text-slate-200' : log.status === 'warning' ? 'text-amber-200' : 'text-blue-300'}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SQL Script Accordion Toggle */}
      <div className="pt-1">
        <button
          onClick={() => setShowSqlCode(!showSqlCode)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          {showSqlCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showSqlCode ? 'Hide SQL Script' : 'View Full SQL Script'}
        </button>

        {showSqlCode && (
          <div className="mt-3 relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-300/90 overflow-x-auto max-h-80 leading-relaxed">
              {FULL_SQL_SCRIPT}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
