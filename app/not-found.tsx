import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-2 bg-brand-charcoal text-white rounded-md hover:bg-brand-charcoal/90">
        Return Home
      </Link>
    </div>
  );
}
