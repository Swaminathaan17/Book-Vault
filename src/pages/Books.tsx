import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useLibrary } from '@/context/LibraryContext';
import { Book } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Edit2, Trash2, BookOpen, MoreVertical, Calendar, BookMarked, CornerUpLeft, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { isOverdue } from '@/lib/overdue';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { EmptyState } from '@/components/EmptyState';

export default function Books() {
  const { books, categories, addBook, updateBook, deleteBook, members, borrowBook, returnBook, settings } = useLibrary();
  const { toast } = useToast();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '', author: '', isbn: '', category: categories[0]?.name || '', year: new Date().getFullYear(), description: ''
  });
  const [borrowMemberId, setBorrowMemberId] = useState('');
  const [borrowDueDate, setBorrowDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number>(0);
  const [swipeState, setSwipeState] = useState<{ bookId: string; offset: number } | null>(null);
  const SWIPE_THRESHOLD = 80;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const filteredBooks = useMemo(() => {
    setCurrentPage(1); // Reset page on filter change
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                            book.author.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
      let matchesStatus = true;
      if (statusFilter === 'overdue') {
        matchesStatus = book.status === 'borrowed' && isOverdue(book.dueDate);
      } else if (statusFilter !== 'All') {
        matchesStatus = book.status === statusFilter;
      }
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, search, categoryFilter, statusFilter]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.category) return;
    
    addBook({
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn || '',
      category: formData.category,
      year: Number(formData.year) || new Date().getFullYear(),
      description: formData.description || ''
    });
    
    toast({ title: "Book added", description: `"${formData.title}" has been added to the catalog.` });
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !formData.title || !formData.author || !formData.category) return;
    
    updateBook(selectedBook.id, {
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      year: Number(formData.year),
      description: formData.description
    });
    
    toast({ title: "Book updated", description: `"${formData.title}" has been updated.` });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedBook) return;
    deleteBook(selectedBook.id);
    toast({ title: "Book deleted", description: `"${selectedBook.title}" has been removed.` });
    setIsDeleteOpen(false);
  };

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !borrowMemberId) return;
    borrowBook(selectedBook.id, borrowMemberId, borrowDueDate);
    toast({ title: "Book borrowed", description: `"${selectedBook.title}" has been checked out.` });
    setIsBorrowOpen(false);
    setBorrowMemberId('');
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setBorrowDueDate(d.toISOString().split('T')[0]);
  };

  const handleReturn = (book: Book) => {
    returnBook(book.id);
    toast({ title: "Book returned", description: `"${book.title}" has been returned.` });
  };

  const openEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData(book);
    setIsEditOpen(true);
  };

  const openDelete = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteOpen(true);
  };

  const openBorrow = (book: Book) => {
    setSelectedBook(book);
    setIsBorrowOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', author: '', isbn: '', category: categories[0]?.name || '', year: new Date().getFullYear(), description: ''
    });
  };

  const memberBorrowedCount = borrowMemberId
    ? (members.find(m => m.id === borrowMemberId)?.borrowedBooks.length ?? 0)
    : 0;
  const atBorrowLimit = memberBorrowedCount >= settings.borrowLimit;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'borrowed': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'reserved': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Manage the library's catalog.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Enter the details for the new book.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. The Great Gatsby" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input id="author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required placeholder="e.g. F. Scott Fitzgerald" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} placeholder="e.g. 978-..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Publication Year</Label>
                    <Input id="year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={val => setFormData({...formData, category: val})} required>
                    <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief synopsis..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Save Book</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or author..." 
            className="pl-9 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="border rounded-xl border-dashed">
          <EmptyState
            variant={search || categoryFilter !== 'All' || statusFilter !== 'All' ? 'search' : 'books'}
            title={search || categoryFilter !== 'All' || statusFilter !== 'All' ? 'No books match your filters' : 'No books yet'}
            description={search || categoryFilter !== 'All' || statusFilter !== 'All' ? 'Try adjusting your search or clearing the filters.' : 'Add your first book to get started.'}
            action={(search || categoryFilter !== 'All' || statusFilter !== 'All') ? (
              <Button variant="outline" onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); }}>
                Clear Filters
              </Button>
            ) : undefined}
          />
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedBooks.map((book, index) => {
              const category = categories.find(c => c.name === book.category);
              const colorClass = category?.color || 'bg-slate-500';
              const overdue = book.status === 'borrowed' && isOverdue(book.dueDate);
              const borrower = book.borrowedBy ? members.find(m => m.id === book.borrowedBy) : null;
              
              return (
                <div key={book.id} className="relative overflow-hidden rounded-xl">
                  {book.status === 'borrowed' && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-destructive px-5 rounded-xl">
                      <div className="flex flex-col items-center text-destructive-foreground">
                        <CornerUpLeft className="h-5 w-5" />
                        <span className="text-xs font-semibold mt-1">Return</span>
                      </div>
                    </div>
                  )}
                  <Card
                    className={`overflow-hidden flex flex-col group hover:border-primary/50 transition-colors animate-in fade-in ${overdue ? 'border-destructive/50' : ''}`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both',
                      ...(swipeState?.bookId === book.id
                        ? { transform: `translateX(-${swipeState.offset}px)`, transition: 'none' }
                        : { transition: 'transform 0.25s ease' })
                    }}
                    onTouchStart={(e) => { if (book.status === 'borrowed') touchStartX.current = e.touches[0].clientX; }}
                    onTouchMove={(e) => {
                      if (book.status !== 'borrowed') return;
                      const delta = touchStartX.current - e.touches[0].clientX;
                      if (delta > 0) setSwipeState({ bookId: book.id, offset: Math.min(delta, 130) });
                    }}
                    onTouchEnd={() => {
                      if (swipeState?.bookId === book.id && swipeState.offset >= SWIPE_THRESHOLD) {
                        handleReturn(book);
                      }
                      setSwipeState(null);
                    }}
                  >
                  <div className="h-32 w-full relative flex items-center justify-center opacity-80" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className={`absolute inset-0 opacity-20 ${colorClass}`} />
                    <BookOpen className={`h-12 w-12 ${colorClass.replace('bg-', 'text-').replace('-500', '-600')}`} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {book.status === 'borrowed' && (
                        <Button variant="secondary" size="sm" className="h-8 shadow-sm gap-1 bg-background/80 backdrop-blur-sm" onClick={() => handleReturn(book)}>
                          <CornerUpLeft className="h-3.5 w-3.5" /> Return
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(book)}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          {book.status === 'available' && (
                            <DropdownMenuItem onClick={() => openBorrow(book)}>
                              <Calendar className="h-4 w-4 mr-2" /> Mark as Borrowed
                            </DropdownMenuItem>
                          )}
                          {book.status === 'borrowed' && (
                            <DropdownMenuItem onClick={() => handleReturn(book)}>
                              <BookMarked className="h-4 w-4 mr-2" /> Mark as Returned
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDelete(book)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Book
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-5 pt-6">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <Badge variant="secondary" className="font-normal text-xs">{book.category}</Badge>
                      <div className="flex gap-1.5">
                        {overdue && <Badge variant="destructive" className="font-medium border border-destructive/20 text-[10px] px-1.5">Overdue</Badge>}
                        <Badge variant="outline" className={`font-medium border ${getStatusColor(book.status)}`}>
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{book.author}</p>
                    
                    {book.status === 'borrowed' && book.dueDate && (
                      <div className="mt-auto pt-4 border-t text-xs flex flex-col gap-1.5">
                        {borrower && <div className="text-muted-foreground font-medium">Borrower: {borrower.name}</div>}
                        <div className={`flex items-center gap-1.5 font-medium ${overdue ? 'text-destructive' : 'text-amber-600 dark:text-amber-500'}`}>
                          <Calendar className="h-3.5 w-3.5" /> Due: {new Date(book.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-4">Page {currentPage} of {totalPages}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
              <DialogDescription>Update details for this book.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input id="edit-title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-author">Author *</Label>
                <Input id="edit-author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-isbn">ISBN</Label>
                  <Input id="edit-isbn" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-year">Publication Year</Label>
                  <Input id="edit-year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={val => setFormData({...formData, category: val})} required>
                  <SelectTrigger id="edit-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Borrow Dialog */}
      <Dialog open={isBorrowOpen} onOpenChange={(open) => { setIsBorrowOpen(open); if(!open) setBorrowMemberId(''); }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleBorrow}>
            <DialogHeader>
              <DialogTitle>Borrow Book</DialogTitle>
              <DialogDescription>Check out "{selectedBook?.title}" to a member.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member">Select Member *</Label>
                <Select value={borrowMemberId} onValueChange={setBorrowMemberId} required>
                  <SelectTrigger id="member"><SelectValue placeholder="Choose a member..." /></SelectTrigger>
                  <SelectContent>
                    {members.map(m => {
                      const count = m.borrowedBooks.length;
                      const over = count >= settings.borrowLimit;
                      return (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}{over ? ` (limit reached: ${count}/${settings.borrowLimit})` : ` (${count}/${settings.borrowLimit})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {atBorrowLimit && borrowMemberId && (
                  <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    This member has reached the {settings.borrowLimit}-book borrow limit.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" value={borrowDueDate} onChange={e => setBorrowDueDate(e.target.value)} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBorrowOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!borrowMemberId || atBorrowLimit}>Confirm Borrow</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
