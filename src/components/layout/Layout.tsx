import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { GlobalSearch } from '../GlobalSearch';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { useTheme } from '../theme-provider';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bv_sidebar_collapsed') === 'true';
  });
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  // G → D/B/M/C/A/S go-to shortcuts
  useEffect(() => {
    let gPressed = false;
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'g' || e.key === 'G') { gPressed = true; clearTimeout(timer); timer = setTimeout(() => { gPressed = false; }, 1200); return; }
      if (!gPressed) return;
      const map: Record<string, string> = { d: '/', b: '/books', m: '/members', c: '/categories', a: '/analytics', s: '/settings' };
      const dest = map[e.key.toLowerCase()];
      if (dest) { e.preventDefault(); setLocation(dest); gPressed = false; }
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); clearTimeout(timer); };
  }, [setLocation]);

  const toggleSidebar = () => {
    const newVal = !sidebarCollapsed;
    setSidebarCollapsed(newVal);
    localStorage.setItem('bv_sidebar_collapsed', String(newVal));
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-background md:flex-row">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        collapsed={sidebarCollapsed}
        toggleCollapsed={toggleSidebar}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-2 border-b bg-background px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="text-lg font-bold flex-1">BookVault</span>
          <GlobalSearch />
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-14 items-center justify-between border-b bg-background px-6">
          <Breadcrumbs />
          <div className="flex items-center gap-2">
            <GlobalSearch />
            <KeyboardShortcuts />
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  theme === 'light' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  theme === 'system' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  theme === 'dark' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:px-8 md:py-5">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
