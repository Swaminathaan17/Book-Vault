import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { LibraryProvider } from '@/context/LibraryContext';
import { Layout } from '@/components/layout/Layout';

import Dashboard from '@/pages/Dashboard';
import Books from '@/pages/Books';
import Members from '@/pages/Members';
import Categories from '@/pages/Categories';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/books" component={Books} />
        <Route path="/members" component={Members} />
        <Route path="/categories" component={Categories} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bookvault-theme">
      <QueryClientProvider client={queryClient}>
        <LibraryProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LibraryProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
