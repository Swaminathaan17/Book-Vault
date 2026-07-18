import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { useTheme } from '@/components/theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Shield, Database, Bell, DownloadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const { settings, updateSettings } = useLibrary();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [libraryName, setLibraryName] = useState(settings.libraryName);
  const [borrowLimit, setBorrowLimit] = useState(settings.borrowLimit ?? 3);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = libraryName !== settings.libraryName || borrowLimit !== (settings.borrowLimit ?? 3);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ libraryName, borrowLimit });
      toast({ title: "Settings saved", description: "Your library settings have been updated." });
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your library system preferences and configuration.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Preferences</CardTitle>
            <CardDescription>Core settings for your BookVault instance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="library-name">Library Name</Label>
              <Input 
                id="library-name" 
                value={libraryName} 
                onChange={(e) => setLibraryName(e.target.value)} 
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">This name appears in the sidebar and reports.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Theme Preference</Label>
              <div className="flex gap-2 items-center mt-1">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  onClick={() => setTheme('light')}
                  className="w-24"
                >Light</Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  onClick={() => setTheme('dark')}
                  className="w-24"
                >Dark</Button>
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  onClick={() => setTheme('system')}
                  className="w-24"
                >System</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button onClick={handleSaveSettings} disabled={isSaving || !isDirty} className="gap-2">
              <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        {/* Borrow Limit */}
        <Card>
          <CardHeader>
            <CardTitle>Lending Rules</CardTitle>
            <CardDescription>Configure borrowing limits and loan policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borrow-limit">Max books per member</Label>
              <div className="flex items-center gap-3">
                <input
                  id="borrow-limit"
                  type="number"
                  min={1}
                  max={20}
                  value={borrowLimit}
                  onChange={e => setBorrowLimit(Math.max(1, Math.min(20, Number(e.target.value))))}
                  className="flex h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm text-muted-foreground">books at a time (1–20)</span>
              </div>
              <p className="text-xs text-muted-foreground">Members cannot borrow more than this many books simultaneously.</p>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="opacity-70 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-background">Coming Soon</Badge>
              </div>
              <CardTitle className="text-lg">Authentication</CardTitle>
              <CardDescription>Multi-user login with role-based access control.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <Label>Require login</Label>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <Label>Allow public catalog</Label>
                  <Switch disabled checked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-70 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                  <Database className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-background">Coming Soon</Badge>
              </div>
              <CardTitle className="text-lg">Database Integration</CardTitle>
              <CardDescription>Connect to external PostgreSQL or Supabase.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2 opacity-50 pointer-events-none">
                  <Label>Provider</Label>
                  <Select disabled><option>Local Storage</option></Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-70 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <Bell className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-background">Coming Soon</Badge>
              </div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Email alerts for due dates and new books.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <Label>Overdue reminders</Label>
                  <Switch disabled checked />
                </div>
                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <Label>Welcome emails</Label>
                  <Switch disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-70 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                  <DownloadCloud className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-background">Coming Soon</Badge>
              </div>
              <CardTitle className="text-lg">Export & Reports</CardTitle>
              <CardDescription>Download your data in CSV or PDF formats.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pt-2 opacity-50 pointer-events-none">
                <Button variant="outline" className="w-full justify-start text-muted-foreground gap-2">
                  <DownloadCloud className="h-4 w-4" /> Export Library Catalog
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
