import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Tags, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function Categories() {
  const { categories, books, addCategory } = useLibrary();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    // Check if category already exists
    if (categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
      toast({ title: "Error", description: "Category already exists.", variant: "destructive" });
      return;
    }
    
    addCategory({ name: formData.name, description: formData.description });
    toast({ title: "Category added", description: `"${formData.name}" has been created.` });
    setIsAddOpen(false);
    setFormData({ name: '', description: '' });
  };

  const navigateToCategory = (categoryName: string) => {
    setLocation(`/books?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize your library collection into genres and topics.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new classification for your books.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Science Fiction" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description of this category..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Create Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => {
          const bookCount = books.filter(b => b.category === category.name).length;
          
          return (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 animate-in fade-in group relative overflow-hidden" 
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              onClick={() => navigateToCategory(category.name)}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${category.color}`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm mb-4 ${category.color}`}>
                    <Tags className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1 font-medium bg-muted">
                    <BookOpen className="h-3 w-3" /> {bookCount}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {category.description || "No description provided for this category."}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
