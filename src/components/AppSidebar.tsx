
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Clock, 
  PanelLeft, 
  Users,
  Workflow,
  CalendarDays,
  FileSpreadsheet,
  BellRing,
  BadgeCheck,
  RefreshCw,
  ChevronRight,
  HelpCircle,
  Settings,
  TrendingUp,
  UserCircle2,
  Shield,
  FolderKanban,
  Sparkles,
  Search,
  CalendarCheck,
  ClipboardList,
  RotateCcw,
  BookOpen,
  BarChart3,
  Cog,
  Radio
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ThemeSelector } from './ThemeSelector';
import { BroadcastNotifications } from './broadcast/BroadcastNotifications';

const AppSidebar = () => {
  const location = useLocation();
  const { user, hasPermission, logout } = useAuth();
  const userRole = user?.role || 'member';

  // Helper function to check if a route is active
  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavigationItem = ({ 
    to, 
    icon: Icon, 
    label, 
    isActive, 
    badge,
    description 
  }: {
    to: string;
    icon: any;
    label: string;
    isActive: boolean;
    badge?: string;
    description?: string;
  }) => (
    <NavLink
      to={to}
      className={cn(
        "group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 relative overflow-hidden",
        isActive 
          ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      aria-describedby={description ? `${label.toLowerCase().replace(/\s+/g, '-')}-desc` : undefined}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full" />
      )}
      
      <Icon className={cn(
        "h-6 w-6 transition-transform duration-200 group-hover:scale-110",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )} 
      aria-hidden="true" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-semibold text-lg truncate",
            isActive ? "text-primary" : ""
          )}>
            {label}
          </span>
          {badge && (
            <Badge variant="secondary" className="ml-2 text-sm" aria-label={`${badge} notifications`}>
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p 
            id={`${label.toLowerCase().replace(/\s+/g, '-')}-desc`}
            className="text-sm text-muted-foreground mt-0.5 truncate"
          >
            {description}
          </p>
        )}
      </div>
      
      {isActive && (
        <ChevronRight className="h-5 w-5 text-primary" aria-hidden="true" />
      )}
    </NavLink>
  );

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    color = "text-primary" 
  }: {
    icon: any;
    title: string;
    color?: string;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3 mb-3">
      <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
    </div>
  );

  const SectionContainer = ({ 
    children, 
    ariaLabel 
  }: { 
    children: React.ReactNode;
    ariaLabel: string;
  }) => (
    <div 
      className="bg-card/30 rounded-xl p-4 mb-4 border border-border/30"
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );

  return (
    <nav 
      className="h-screen w-[280px] fixed left-0 top-0 z-40 flex flex-col bg-card/95 backdrop-blur-sm border-r border-border/50 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ShiftoPia
            </h1>
            <p className="text-sm text-muted-foreground">Workforce Management</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <Input 
            type="text" 
            placeholder="Search pages..." 
            className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-base"
            aria-label="Search navigation pages"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2" role="menubar">
        {/* Main Dashboard */}
        <NavigationItem
          to="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={isRouteActive('/dashboard')}
          description="Overview & analytics"
        />

        {/* My Workspace Section */}
        <SectionContainer ariaLabel="My Workspace section">
          <SectionHeader 
            icon={UserCircle2} 
            title="My Workspace" 
            color="text-purple-500"
          />
          
          <div className="space-y-2" role="menu" aria-label="My Workspace menu">
            <NavigationItem
              to="/my-roster"
              icon={CalendarCheck}
              label="My Roster"
              isActive={isRouteActive('/my-roster')}
              description="Your assigned shifts"
            />
            
            <NavigationItem
              to="/availabilities"
              icon={CalendarDays}
              label="Availabilities"
              isActive={isRouteActive('/availabilities')}
              description="Set your availability"
            />
            
            <NavigationItem
              to="/bids"
              icon={BadgeCheck}
              label="My Bids"
              isActive={isRouteActive('/bids')}
              description="Shift bid requests"
            />
          </div>
        </SectionContainer>

        {/* Rostering Section */}
        {(hasPermission('templates') || hasPermission('rosters') || hasPermission('birds-view') || hasPermission('timesheet-view')) && (
          <SectionContainer ariaLabel="Rostering section">
            <SectionHeader 
              icon={FolderKanban} 
              title="Rostering" 
              color="text-blue-500"
            />
            
            <div className="space-y-2" role="menu" aria-label="Rostering menu">
              {hasPermission('templates') && (
                <NavigationItem
                  to="/templates"
                  icon={BookOpen}
                  label="Templates"
                  isActive={isRouteActive('/templates')}
                  description="Shift templates"
                />
              )}
              
              {hasPermission('rosters') && (
                <NavigationItem
                  to="/rosters"
                  icon={ClipboardList}
                  label="Rosters"
                  isActive={isRouteActive('/rosters')}
                  description="Manage schedules"
                />
              )}
              
              {hasPermission('birds-view') && (
                <NavigationItem
                  to="/birds-view"
                  icon={PanelLeft}
                  label="Birds View"
                  isActive={isRouteActive('/birds-view')}
                  description="Overview of all shifts"
                />
              )}
              
              {hasPermission('timesheet-view') && (
                <NavigationItem
                  to="/timesheet"
                  icon={Clock}
                  label="Timesheet"
                  isActive={isRouteActive('/timesheet')}
                  description="Time tracking"
                />
              )}
            </div>
          </SectionContainer>
        )}

        {/* Management Section */}
        {hasPermission('management') && (
          <SectionContainer ariaLabel="Management section">
            <SectionHeader 
              icon={Shield} 
              title="Management" 
              color="text-green-500"
            />
            
            <div className="space-y-2" role="menu" aria-label="Management menu">
              <NavigationItem
                to="/management/bids"
                icon={BadgeCheck}
                label="Open Bids"
                isActive={isRouteActive('/management/bids')}
                description="Review bid requests"
              />
              
              <NavigationItem
                to="/management/swaps"
                icon={RotateCcw}
                label="Swap Requests"
                isActive={isRouteActive('/management/swaps')}
                description="Approve shift swaps"
              />
            </div>
          </SectionContainer>
        )}

        {/* Additional Features */}
        <SectionContainer ariaLabel="Additional features section">
          <div className="space-y-2" role="menu" aria-label="Additional features menu">
            {hasPermission('broadcast') && (
              <NavigationItem
                to="/broadcast"
                icon={Radio}
                label="Broadcast"
                isActive={isRouteActive('/broadcast')}
                description="Send notifications"
              />
            )}
            
            {hasPermission('insights') && (
              <NavigationItem
                to="/insights"
                icon={BarChart3}
                label="Insights"
                isActive={isRouteActive('/insights')}
                description="Analytics & reports"
              />
            )}
            
            {hasPermission('configurations') && (
              <NavigationItem
                to="/configurations"
                icon={Cog}
                label="Configurations"
                isActive={isRouteActive('/configurations')}
                description="System settings"
              />
            )}
          </div>
        </SectionContainer>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <ThemeSelector />
          <BroadcastNotifications isCollapsed={false} />
        </div>

        <Separator />

        {/* User Profile */}
        {user && (
          <div 
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
            role="group"
            aria-label="User profile information"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
        )}

        {/* Help Button */}
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full justify-start gap-3 h-12 text-base font-semibold"
          aria-label="Access help and support"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
          <span>Help & Support</span>
        </Button>
      </div>
    </nav>
  );
};

export default AppSidebar;
