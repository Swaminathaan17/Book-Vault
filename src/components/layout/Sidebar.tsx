import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, LayoutDashboard, Library, Users, Tags, Settings, Sun, Moon, Monitor, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  collapsed = false, 
  toggleCollapsed 
}: { 
  mobileMenuOpen: boolean, 
  setMobileMenuOpen: (open: boolean) => void,
  collapsed?: boolean,
  toggleCollapsed?: () => void
}) {
  const [location] = useLocation();
  const { settings } = useLibrary();
  const { theme, setTheme } = useTheme();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/books', label: 'Books', icon: Library },
    { href: '/members', label: 'Members', icon: Users },
    { href: '/categories', label: 'Categories', icon: Tags },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:static md:translate-x-0 relative",
        mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full",
        !mobileMenuOpen && (collapsed ? "md:w-[68px]" : "md:w-64")
      )}>
        {toggleCollapsed && (
          <button 
            onClick={toggleCollapsed}
            className="hidden md:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted z-50"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        )}

        <div className={cn("flex h-16 items-center border-b border-sidebar-border px-6", collapsed ? "justify-center px-0" : "")}>
          <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-lg font-bold leading-tight tracking-tight truncate">BookVault</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">{settings.libraryName}</span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4 overflow-x-hidden">
          <nav className={cn("grid gap-1", collapsed ? "px-2" : "px-4")}>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <div 
                    title={collapsed ? link.label : undefined}
                    className={cn(
                    "flex items-center rounded-md text-sm font-medium transition-colors cursor-pointer",
                    collapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}>
                    <Icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                    {!collapsed && <span>{link.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 transition-colors flex-1",
                  theme === 'light' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 transition-colors flex-1",
                  theme === 'system' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 transition-colors flex-1",
                  theme === 'dark' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
