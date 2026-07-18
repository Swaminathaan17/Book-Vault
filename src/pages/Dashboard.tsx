import React, { useMemo, useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Users, Library, Activity, BookMarked, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { isOverdue, getDaysOverdue } from '@/lib/overdue';
import { useToast } from '@/hooks/use-toast';

const getSnoozedToday = (): string[] => {
  try {
    const raw = localStorage.getItem('bv_snoozed_overdue');
    if (!raw) return [];
    const { date, ids } = JSON.parse(raw);
    return date === new Date().toDateString() ? ids : [];
  } catch { return []; }
};

export default function Dashboard() {
  const { books, members, categories, activities } = useLibrary();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [snoozed, setSnoozed] = useState<string[]>(getSnoozedToday);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const snoozeBook = (bookId: string) => {
    const next = [...snoozed, bookId];
    setSnoozed(next);
    localStorage.setItem('bv_snoozed_overdue', JSON.stringify({ date: new Date().toDateString(), ids: next }));
    toast({ title: 'Alert dismissed', description: 'Overdue alert hidden for today.' });
  };

  const overdueBooks = useMemo(() => {
    return books.filter(b => b.status === 'borrowed' && isOverdue(b.dueDate));
  }, [books]);

  const visibleOverdueBooks = useMemo(() => {
    return overdueBooks.filter(b => !snoozed.includes(b.id));
  }, [overdueBooks, snoozed]);

  const stats = useMemo(() => {
    return {
      total: books.length,
      available: books.filter(b => b.status === 'available').length,
      borrowed: books.filter(b => b.status === 'borrowed').length,
      members: members.length,
      categories: categories.length,
    };
  }, [books, members, categories]);

  const chartData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      value: books.filter(b => b.category === cat.name).length,
      color: cat.color.replace('bg-', 'text-').replace('-500', '-500') // not using this directly in recharts easily with tailwind tokens, will use var(--primary) or something
    }));
  }, [categories, books]);

  const recentBooks = useMemo(() => {
    return [...books].reverse().slice(0, 5);
  }, [books]);

  const recentActivities = useMemo(() => {
    return activities.slice(0, 8);
  }, [activities]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'borrowed': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'reserved': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-xl border p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="lg:col-span-3 rounded-xl border p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your library's current status and activity.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <BookMarked className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowed}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueBooks.length}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {visibleOverdueBooks.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Action Required: Overdue Books
              </CardTitle>
              {overdueBooks.length > visibleOverdueBooks.length && (
                <span className="text-xs text-muted-foreground">{overdueBooks.length - visibleOverdueBooks.length} dismissed today</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleOverdueBooks.map(book => {
                const member = members.find(m => m.id === book.borrowedBy);
                return (
                  <div key={book.id} className="relative flex flex-col p-3 border rounded-lg bg-background shadow-sm pr-8">
                    <button
                      onClick={() => snoozeBook(book.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Dismiss for today"
                      title="Dismiss for today"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-semibold truncate">{book.title}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Borrower: {member?.name || 'Unknown'}
                    </span>
                    <span className="text-sm font-medium text-destructive mt-2">
                      {getDaysOverdue(book.dueDate)} days overdue (Due {new Date(book.dueDate!).toLocaleDateString()})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
            <CardDescription>Distribution of the library collection</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the library</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-6">
              {recentActivities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No recent activity</div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
                      {activity.type === 'borrowed' && <TrendingUp className="h-4 w-4" />}
                      {activity.type === 'returned' && <BookMarked className="h-4 w-4" />}
                      {activity.type === 'added' && <BookOpen className="h-4 w-4" />}
                      {activity.type === 'member_joined' && <Users className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added Books</CardTitle>
          <CardDescription>The newest additions to our catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 font-medium">Book</th>
                  <th className="pb-3 font-medium">Author</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentBooks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">No books available</td>
                  </tr>
                ) : (
                  recentBooks.map(book => {
                    const category = categories.find(c => c.name === book.category);
                    const colorClass = category?.color || 'bg-slate-500';
                    return (
                      <tr key={book.id} className="group hover:bg-muted/50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-8 rounded-sm ${colorClass} shadow-sm flex-shrink-0 opacity-80`} />
                            <span className="font-medium truncate max-w-[200px] md:max-w-xs" title={book.title}>{book.title}</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{book.author}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="font-normal">{book.category}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="outline" className={getStatusColor(book.status)}>
                            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
