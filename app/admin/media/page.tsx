import { redirect } from 'next/navigation';

// The Media Library is disabled for now. The implementation is kept in
// ./MediaLibrary.tsx; see the note at the top of that file to re-enable.
export default function AdminMediaPage() {
  redirect('/admin');
}
