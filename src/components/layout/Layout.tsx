
import React from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="md:w-64 bg-card border-r">
        <Navbar />
      </aside>
      <main className={cn("flex-1 p-6 md:p-8", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
