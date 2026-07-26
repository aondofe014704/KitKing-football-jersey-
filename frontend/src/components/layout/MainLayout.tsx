import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gray">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
