import { redirect } from 'next/navigation';

export default function HomePage() {
  // Automatically redirect users landing on the root path to the login page.
  redirect('/login');
}