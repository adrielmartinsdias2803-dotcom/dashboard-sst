import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Settings, 
  Menu,
  X,
  ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Visão Geral", path: "/" },
    { icon: AlertTriangle, label: "Riscos", path: "/riscos" },
    { icon: BarChart3, label: "Análises", path: "/analises" },
    { icon: FileText, label: "Relatórios", path: "/relatorios" },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar-accent/10">
          <ShieldAlert className="h-8 w-8 text-primary mr-3" />
          <span className="font-display font-bold text-xl tracking-wide text-sidebar-foreground">
            GESTÃO <span className="text-primary">SST</span>
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <a 
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    )} 
                  />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/30 rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Status do Sistema</h4>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium">Operacional</span>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">Administrador SST</p>
              <p className="text-xs text-muted-foreground mt-1">admin@empresa.com</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
