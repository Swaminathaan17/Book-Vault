import React, { useState, useMemo, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Member } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, UserCircle, Mail, Phone, Calendar, BookMarked, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { isOverdue } from '@/lib/overdue';

export default function Members() {
  const { members, books, addMember, updateMember } = useLibrary();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0]
  });

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.name.toLowerCase().includes(search.toLowerCase()) || 
      member.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    addMember({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
    });
    
    toast({ title: "Member added", description: `${formData.name} has been added.` });
    setIsAddOpen(false);
    setFormData({ name: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0] });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const openMemberDetail = (member: Member) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const memberBorrowedBooks = useMemo(() => {
    if (!selectedMember) return [];
    return books.filter(b => selectedMember.borrowedBooks.includes(b.id));
  }, [selectedMember, books]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="rounded-xl border">
        <div className="p-4 border-b"><Skeleton className="h-10 w-full max-w-md" /></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage library members and their borrowing history.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Register a new patron to the library.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Jane Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="jane@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. 555-0199" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input id="joinDate" type="date" value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Register Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="p-4 border-b flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members by name or email..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {filteredMembers.length === 0 ? (
          <EmptyState
            variant={search ? 'search' : 'members'}
            title={search ? 'No members match your search' : 'No members yet'}
            description={search ? 'Try a different name or email address.' : 'Register your first library member to get started.'}
          />
        ) : (
        <div className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Borrowed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openMemberDetail(member)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {getInitials(member.name)}
                        </div>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {member.email}</span>
                        {member.phone && <span className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" /> {member.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {member.borrowedBooks.length > 0 ? (
                        <Badge variant="secondary">{member.borrowedBooks.length} books</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openMemberDetail(member); }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
        )}
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
          {selectedMember && (
            <>
              <div className="bg-muted p-6 flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-sm">
                  {getInitials(selectedMember.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {selectedMember.email}</span>
                    {selectedMember.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {selectedMember.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" /> Currently Borrowed ({memberBorrowedBooks.length})
                </h3>
                
                {memberBorrowedBooks.length === 0 ? (
                  <div className="text-center py-6 border rounded-lg bg-muted/30 text-muted-foreground">
                    This member has no currently borrowed books.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberBorrowedBooks.map(book => {
                      const overdue = isOverdue(book.dueDate);
                      return (
                      <div key={book.id} className={`flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors ${overdue ? 'border-destructive/30 bg-destructive/5' : ''}`}>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {book.title}
                            {overdue && <Badge variant="destructive" className="text-[10px] h-4 px-1.5 py-0">Overdue</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{book.author}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className={`font-medium ${overdue ? 'text-destructive' : 'text-amber-600'}`}>Due: {new Date(book.dueDate!).toLocaleDateString()}</div>
                          <Badge variant="outline" className="mt-1 font-normal">{book.category}</Badge>
                        </div>
                      </div>
                    )})}
                  </div>
                )}
                
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Calendar className="h-4 w-4" /> Member since {new Date(selectedMember.joinDate).toLocaleDateString()}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
