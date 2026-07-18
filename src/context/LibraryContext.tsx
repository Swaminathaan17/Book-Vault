import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Member, Category, ActivityEvent } from '../types';
import { mockBooks, mockMembers, mockCategories, mockActivities } from '../data/mock';

export interface LibrarySettings {
  libraryName: string;
  borrowLimit: number;
}

interface LibraryContextType {
  books: Book[];
  members: Member[];
  categories: Category[];
  activities: ActivityEvent[];
  settings: LibrarySettings;
  addBook: (book: Omit<Book, 'id' | 'status'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addMember: (member: Omit<Member, 'id' | 'borrowedBooks'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  addCategory: (category: Omit<Category, 'id' | 'color'>) => void;
  borrowBook: (bookId: string, memberId: string, customDueDate?: string) => void;
  returnBook: (bookId: string) => void;
  updateSettings: (settings: LibrarySettings) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [settings, setSettings] = useState<LibrarySettings>({ libraryName: 'BookVault Library', borrowLimit: 3 });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedBooks = localStorage.getItem('bv_books');
    const savedMembers = localStorage.getItem('bv_members');
    const savedCategories = localStorage.getItem('bv_categories');
    const savedActivities = localStorage.getItem('bv_activities');
    const savedSettings = localStorage.getItem('bv_settings');

    setBooks(savedBooks ? JSON.parse(savedBooks) : mockBooks);
    setMembers(savedMembers ? JSON.parse(savedMembers) : mockMembers);
    setCategories(savedCategories ? JSON.parse(savedCategories) : mockCategories);
    setActivities(savedActivities ? JSON.parse(savedActivities) : mockActivities);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ libraryName: 'BookVault Library', borrowLimit: 3, ...parsed });
    }
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('bv_books', JSON.stringify(books));
      localStorage.setItem('bv_members', JSON.stringify(members));
      localStorage.setItem('bv_categories', JSON.stringify(categories));
      localStorage.setItem('bv_activities', JSON.stringify(activities));
      localStorage.setItem('bv_settings', JSON.stringify(settings));
    }
  }, [books, members, categories, activities, settings, isHydrated]);

  const logActivity = (type: ActivityEvent['type'], description: string, bookId?: string, memberId?: string) => {
    const newActivity: ActivityEvent = {
      id: `a${Date.now()}`,
      type,
      description,
      bookId,
      memberId,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };

  const addBook = (bookData: Omit<Book, 'id' | 'status'>) => {
    const newBook: Book = {
      ...bookData,
      id: `b${Date.now()}`,
      status: 'available',
    };
    setBooks(prev => [newBook, ...prev]);
    logActivity('added', `New book added: ${newBook.title}`, newBook.id);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const addMember = (memberData: Omit<Member, 'id' | 'borrowedBooks'>) => {
    const newMember: Member = {
      ...memberData,
      id: `m${Date.now()}`,
      borrowedBooks: [],
    };
    setMembers(prev => [newMember, ...prev]);
    logActivity('member_joined', `${newMember.name} joined the library`, undefined, newMember.id);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'color'>) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-indigo-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-emerald-500'];
    const newCategory: Category = {
      ...categoryData,
      id: `c${Date.now()}`,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const borrowBook = (bookId: string, memberId: string, customDueDate?: string) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member || book.status !== 'available') return;

    const dueDate = customDueDate ? new Date(customDueDate) : new Date();
    if (!customDueDate) {
      dueDate.setDate(dueDate.getDate() + 14);
    }

    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'borrowed', borrowedBy: memberId, dueDate: dueDate.toISOString().split('T')[0] } : b));
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, borrowedBooks: [...m.borrowedBooks, bookId] } : m));
    
    logActivity('borrowed', `${member.name} borrowed ${book.title}`, bookId, memberId);
  };

  const returnBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.status !== 'borrowed' || !book.borrowedBy) return;

    const memberId = book.borrowedBy;
    const member = members.find(m => m.id === memberId);

    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'available', borrowedBy: undefined, dueDate: undefined } : b));
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, borrowedBooks: m.borrowedBooks.filter(id => id !== bookId) } : m));
    
    logActivity('returned', `${member?.name || 'Unknown'} returned ${book.title}`, bookId, memberId);
  };

  const updateSettings = (newSettings: LibrarySettings) => {
    setSettings(newSettings);
  };

  return (
    <LibraryContext.Provider value={{
      books, members, categories, activities, settings,
      addBook, updateBook, deleteBook, addMember, updateMember, addCategory, borrowBook, returnBook, updateSettings
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
