import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "wouter";

function Navigation() {
  return (
    <NavigationMenu className="border-b mb-4">
      <NavigationMenuList className="container mx-auto px-4 py-2">
        <NavigationMenuItem>
          <Link href="/dashboard">
            <NavigationMenuLink className="cursor-pointer">Admin Dashboard</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function Router() {
  return (
    <div>
      <Switch>
        {/* Public landing page as root */}
        <Route path="/" component={Landing} />
        {/* Admin route */}
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;