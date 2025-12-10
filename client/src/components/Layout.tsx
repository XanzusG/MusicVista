import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>
      <footer className="bg-neutral-900 text-neutral-100 py-12 mt-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-h3 font-semibold mb-4">MusicVista</h3>
              <p className="text-small text-neutral-500">Intelligent Music Discovery and Analysis Platform</p>
            </div>
            <div>
              <h4 className="text-body font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-small text-neutral-500">
                <li>About Us</li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-body font-semibold mb-4">Contact Us</h4>
              <p className="text-small text-neutral-500">support@musicvista.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-700 text-center text-small text-neutral-500">
            © 2025 MusicVista. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
