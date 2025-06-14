
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
  ChevronDown,
  HelpCircle,
  Settings,
  TrendingUp  // Added the missing import
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

const AppSidebar = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { state } = useSidebar();
  const userRole = user?.role || 'member';

  // Helper function to check if a route is active
  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    // For submenus, check if the current path starts with the submenu path
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 pb-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-semibold transition-opacity",
                state === "collapsed" && "opacity-0"
              )}>
                ShiftoPia
              </span>
            </div>
          </SidebarGroupLabel>
            
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/dashboard')}
                  tooltip="Dashboard"
                  asChild
                >
                  <NavLink to="/dashboard" className="transition-colors hover:bg-muted/50">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
                
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/my-roster')}
                  tooltip="My Roster"
                  asChild
                >
                  <NavLink to="/my-roster" className="transition-colors hover:bg-muted/50">
                    <Calendar className="h-5 w-5" />
                    <span>My Roster</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/availabilities')}
                  tooltip="Availabilities"
                  asChild
                >
                  <NavLink to="/availabilities" className="transition-colors hover:bg-muted/50">
                    <CalendarDays className="h-5 w-5" />
                    <span>Availabilities</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/bids')}
                  tooltip="My Bids"
                  asChild
                >
                  <NavLink to="/bids" className="transition-colors hover:bg-muted/50">
                    <BadgeCheck className="h-5 w-5" />
                    <span>My Bids</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {(hasPermission('templates') || hasPermission('rosters') || hasPermission('birds-view') || hasPermission('timesheet-view')) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={
                      isRouteActive('/templates') ||
                      isRouteActive('/rosters') ||
                      isRouteActive('/birds-view') ||
                      isRouteActive('/timesheet')
                    }
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Rostering</span>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {hasPermission('templates') && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/templates')}
                          asChild
                        >
                          <NavLink to="/templates" className="transition-colors hover:bg-muted/50">
                            <Workflow className="h-4 w-4" />
                            <span>Templates</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('rosters') && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/rosters')}
                          asChild
                        >
                          <NavLink to="/rosters" className="transition-colors hover:bg-muted/50">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Rosters</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('birds-view') && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/birds-view')}
                          asChild
                        >
                          <NavLink to="/birds-view" className="transition-colors hover:bg-muted/50">
                            <PanelLeft className="h-4 w-4" />
                            <span>Birds View</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('timesheet-view') && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/timesheet')}
                          asChild
                        >
                          <NavLink to="/timesheet" className="transition-colors hover:bg-muted/50">
                            <Clock className="h-4 w-4" />
                            <span>Timesheet</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )}

              {hasPermission('management') && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={
                      isRouteActive('/management/bids') ||
                      isRouteActive('/management/swaps')
                    }
                  >
                    <Users className="h-5 w-5" />
                    <span>Management</span>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        isActive={isRouteActive('/management/bids')}
                        asChild
                      >
                        <NavLink to="/management/bids" className="transition-colors hover:bg-muted/50">
                          <BadgeCheck className="h-4 w-4" />
                          <span>Open Bids</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        isActive={isRouteActive('/management/swaps')}
                        asChild
                      >
                        <NavLink to="/management/swaps" className="transition-colors hover:bg-muted/50">
                          <RefreshCw className="h-4 w-4" />
                          <span>Swap Requests</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )}
              
              {hasPermission('broadcast') && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={isRouteActive('/broadcast')}
                    tooltip="Broadcast"
                    asChild
                  >
                    <NavLink to="/broadcast" className="transition-colors hover:bg-muted/50">
                      <BellRing className="h-5 w-5" />
                      <span>Broadcast</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('insights') && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={isRouteActive('/insights')}
                    tooltip="Insights"
                    asChild
                  >
                    <NavLink to="/insights" className="transition-colors hover:bg-muted/50">
                      <TrendingUp className="h-5 w-5" />
                      <span>Insights</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('configurations') && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={isRouteActive('/configurations')}
                    tooltip="Configurations"
                    asChild
                  >
                    <NavLink to="/configurations" className="transition-colors hover:bg-muted/50">
                      <Settings className="h-5 w-5" />
                      <span>Configurations</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden md:block">
        <div className="p-2 flex items-center justify-center">
          <Button variant="outline" size="sm" className="w-full">
            <span className={cn(
              "transition-opacity",
              state === "collapsed" && "opacity-0"
            )}>
              Help & Support
            </span>
            <HelpCircle className={cn(
              "h-4 w-4",
              state !== "collapsed" && "ml-2"
            )} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
