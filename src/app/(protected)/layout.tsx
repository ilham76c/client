import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />

      <main className='flex-1'>{children}</main>

      <Footer />
    </div>
  );
}
