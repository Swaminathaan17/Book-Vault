import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLibrary } from '@/context/LibraryContext';
import { BookOpen, Users, Tags, Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { books, members, categories } = useLibrary();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Books">
            {books.map((book) => (
              <CommandItem
                key={`book-${book.id}`}
                value={`book ${book.title} ${book.author} ${book.category}`}
                onSelect={() => runCommand(() => setLocation('/books'))}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{book.title}</span>
                  <span className="text-xs text-muted-foreground">{book.author} • {book.category}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Members">
            {members.map((member) => (
              <CommandItem
                key={`member-${member.id}`}
                value={`member ${member.name} ${member.email}`}
                onSelect={() => runCommand(() => setLocation('/members'))}
              >
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{member.name}</span>
                  <span className="text-xs text-muted-foreground">{member.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Categories">
            {categories.map((cat) => (
              <CommandItem
                key={`category-${cat.id}`}
                value={`category ${cat.name} ${cat.description}`}
                onSelect={() => runCommand(() => setLocation('/categories'))}
              >
                <Tags className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
