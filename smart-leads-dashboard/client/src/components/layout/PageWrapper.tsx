import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export default function PageWrapper({ children, title, action }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {(title || action) && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              {title ? (
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              ) : (
                <div />
              )}
              {action}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
