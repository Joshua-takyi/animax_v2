import { Navbar } from '@/components/nav';
import Footer from '@/components/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
}
