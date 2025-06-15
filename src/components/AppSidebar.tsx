
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, Clock, PanelLeft, Users, Workflow, CalendarDays, FileSpreadsheet, BellRing, BadgeCheck, RefreshCw, ChevronRight, HelpCircle, Settings, TrendingUp, UserCircle2, Shield, FolderKanban, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ThemeSelector } from './ThemeSelector';
import { BroadcastNotifications } from './broadcast/BroadcastNotifications';
const iconColorMap: Record<string, string> = {
  dashboard: 'text-blue-400',
  workspace: 'text-purple-400',
  myRoster: 'text-cyan-400',
  availabilities: 'text-teal-400',
  myBids: 'text-pink-400',
  templates: 'text-sky-400',
  rosters: 'text-indigo-400',
  birdsView: 'text-fuchsia-400',
  timesheet: 'text-amber-400',
  openBids: 'text-green-400',
  swapRequests: 'text-orange-400',
  broadcast: 'text-red-400',
  insights: 'text-yellow-400',
  configurations: 'text-gray-400',
  management: 'text-lime-400',
  sectionMyWorkspace: 'text-purple-400',
  sectionRostering: 'text-blue-400',
  sectionManagement: 'text-green-400',
  logo: 'text-white'
};
const AppSidebar = () => {
  const location = useLocation();
  const {
    user,
    hasPermission,
    logout
  } = useAuth();
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
    iconColor,
    label,
    isActive,
    badge,
    description
  }: {
    to: string;
    icon: any;
    iconColor: string;
    label: string;
    isActive: boolean;
    badge?: string;
    description?: string;
  }) => <NavLink to={to} className={cn("group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative overflow-hidden", isActive ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
      {isActive && <div className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-full" />}
      {/* Smaller colored Icon */}
      <Icon className={cn("h-5 w-5 transition-transform duration-150 group-hover:scale-105", iconColor, isActive ? "drop-shadow" : "")} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-center">
            {label}
          </span>
          {badge && <Badge variant="secondary" className="ml-1 text-[11px]">
              {badge}
            </Badge>}
        </div>
        {description && <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {description}
          </p>}
      </div>
      {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
    </NavLink>;
  const SectionHeader = ({
    icon: Icon,
    title,
    color = "text-primary"
  }: {
    icon: any;
    title: string;
    color?: string;
  }) => <div className="flex items-center gap-2 mb-1 py-0 my-0 bg-inherit px-4 mx-0 rounded-full">
      <Icon className={cn("h-5 w-5", color)} />
      <span className="uppercase tracking-wide text-muted-foreground text-xs font-semibold">
        {title}
      </span>
    </div>;
  return <div className="h-screen w-[280px] fixed left-0 top-0 z-40 flex flex-col bg-card/95 backdrop-blur-sm border-r border-border/50 shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className={cn("h-5 w-5", iconColorMap.logo)} />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-tight">
              ShiftoPia
            </h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">Workforce Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-start space-y-3 py-2 px-1 bg-inherit">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavigationItem to="/dashboard" icon={LayoutDashboard} iconColor={iconColorMap.dashboard} label="Dashboard" isActive={isRouteActive('/dashboard')} description="Overview & analytics" />
        </div>

        {/* My Workspace Section */}
        <div className="space-y-1">
          <SectionHeader icon={UserCircle2} title="My Workspace" color={iconColorMap.sectionMyWorkspace} />
          
          <NavigationItem to="/my-roster" icon={Calendar} iconColor={iconColorMap.myRoster} label="My Roster" isActive={isRouteActive('/my-roster')} description="Your assigned shifts" />
          
          <NavigationItem to="/availabilities" icon={CalendarDays} iconColor={iconColorMap.availabilities} label="Availabilities" isActive={isRouteActive('/availabilities')} description="Set your availability" />
          
          <NavigationItem to="/bids" icon={BadgeCheck} iconColor={iconColorMap.myBids} label="My Bids" isActive={isRouteActive('/bids')} description="Shift bid requests" />
        </div>

        {/* Rostering Section */}
        {(hasPermission('templates') || hasPermission('rosters') || hasPermission('birds-view') || hasPermission('timesheet-view')) && <div className="space-y-1">
            <SectionHeader icon={FolderKanban} title="Rostering" color={iconColorMap.sectionRostering} />
            
            {hasPermission('templates') && <NavigationItem to="/templates" icon={Workflow} iconColor={iconColorMap.templates} label="Templates" isActive={isRouteActive('/templates')} description="Shift templates" />}
            
            {hasPermission('rosters') && <NavigationItem to="/rosters" icon={FileSpreadsheet} iconColor={iconColorMap.rosters} label="Rosters" isActive={isRouteActive('/rosters')} description="Manage schedules" />}
            
            {hasPermission('birds-view') && <NavigationItem to="/birds-view" icon={PanelLeft} iconColor={iconColorMap.birdsView} label="Birds View" isActive={isRouteActive('/birds-view')} description="Overview of all shifts" />}
            
            {hasPermission('timesheet-view') && <NavigationItem to="/timesheet" icon={Clock} iconColor={iconColorMap.timesheet} label="Timesheet" isActive={isRouteActive('/timesheet')} description="Time tracking" />}
          </div>}

        {/* Management Section */}
        {hasPermission('management') && <div className="space-y-1">
            <SectionHeader icon={Shield} title="Management" color={iconColorMap.sectionManagement} />
            
            <NavigationItem to="/management/bids" icon={BadgeCheck} iconColor={iconColorMap.openBids} label="Open Bids" isActive={isRouteActive('/management/bids')} description="Review bid requests" />
            
            <NavigationItem to="/management/swaps" icon={RefreshCw} iconColor={iconColorMap.swapRequests} label="Swap Requests" isActive={isRouteActive('/management/swaps')} description="Approve shift swaps" />
          </div>}

        {/* Additional Features */}
        <div className="space-y-1">
          {hasPermission('broadcast') && <NavigationItem to="/broadcast" icon={BellRing} iconColor={iconColorMap.broadcast} label="Broadcast" isActive={isRouteActive('/broadcast')} description="Send notifications" />}
          
          {hasPermission('insights') && <NavigationItem to="/insights" icon={TrendingUp} iconColor={iconColorMap.insights} label="Insights" isActive={isRouteActive('/insights')} description="Analytics & reports" />}
          
          {hasPermission('configurations') && <NavigationItem to="/configurations" icon={Settings} iconColor={iconColorMap.configurations} label="Configurations" isActive={isRouteActive('/configurations')} description="System settings" />}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeSelector />
          <BroadcastNotifications isCollapsed={false} />
        </div>
        <Separator />
        {/* User Profile */}
        {user && <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs truncate">{user.name}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>}
        {/* Help Button */}
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs px-2 py-1">
          <HelpCircle className="h-4 w-4 text-blue-400" />
          <span>Help & Support</span>
        </Button>
      </div>
    </div>;
};
export default AppSidebar;
