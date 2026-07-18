import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Open global search', group: 'Navigation' },
  { keys: ['?'], label: 'Show keyboard shortcuts', group: 'Navigation' },
  { keys: ['G', 'D'], label: 'Go to Dashboard', group: 'Navigation' },
  { keys: ['G', 'B'], label: 'Go to Books', group: 'Navigation' },
  { keys: ['G', 'M'], label: 'Go to Members', group: 'Navigation' },
  { keys: ['G', 'C'], label: 'Go to Categories', group: 'Navigation' },
  { keys: ['G', 'A'], label: 'Go to Analytics', group: 'Navigation' },
  { keys: ['Esc'], label: 'Close dialog / search', group: 'General' },
];

const groups = [...new Set(shortcuts.map(s => s.group))];

interface KeyboardShortcutsProps {
  compact?: boolean;
}

export function KeyboardShortcuts({ compact }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') { e.preventDefault(); setOpen(o => !o); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-5">
            {groups.map(group => (
              <div key={group}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group}</p>
                <div className="space-y-1">
                  {shortcuts.filter(s => s.group === group).map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                      <span className="text-sm text-foreground">{shortcut.label}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, ki) => (
                          <React.Fragment key={ki}>
                            <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground min-w-[24px]">
                              {key}
                            </kbd>
                            {ki < shortcut.keys.length - 1 && (
                              <span className="text-xs text-muted-foreground">then</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground border-t pt-3">
            Press <kbd className="inline-flex items-center rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">?</kbd> anywhere to toggle this panel.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
