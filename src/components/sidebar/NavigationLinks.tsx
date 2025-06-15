
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  BadgeCheck, 
  Clock, 
  FileSpreadsheet, 
  PanelLeft, 
  Workflow,
  Users,
  BellRing,
  Settings,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import NavItem from './NavItem';
import NavSection from './NavSection';
import { useSidebar } from '@/components/ui/sidebar';

interface NavigationLinksProps {
  openMenus: {[key: string]: boolean};
  toggleMenu: (menu: string) => void;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ openMenus, toggleMenu }) => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="flex flex-col h-full space-y-3 py-2">
      {/* Dashboard - Main Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm">
        <CardContent className="p-3">
          <NavItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            path="/dashboard"
            active={isRouteActive('/dashboard')}
            sectionColor="primary"
          />
        </CardContent>
      </Card>

      {/* My Workspace Section Card */}
      <Card className="bg-gradient-to-r from-purple-500/5 to-purple-600/10 border-purple-500/20 shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <NavSection
            title="My Workspace"
            isOpen={openMenus['workspace']}
            onToggle={() => toggleMenu('workspace')}
            collapsed={isCollapsed}
            sectionColor="purple"
          >
            <div className="space-y-1 mt-2">
              <NavItem
                icon={<Calendar className="h-5 w-5" />}
                label="My Roster"
                path="/my-roster"
                active={isRouteActive('/my-roster')}
                indent
                sectionColor="purple"
              />
              <NavItem
                icon={<CalendarDays className="h-5 w-5" />}
                label="Availabilities"
                path="/availabilities"
                active={isRouteActive('/availabilities')}
                indent
                sectionColor="purple"
              />
              <NavItem
                icon={<BadgeCheck className="h-5 w-5" />}
                label="My Bids"
                path="/bids"
                active={isRouteActive('/bids')}
                indent
                sectionColor="purple"
              />
            </div>
          </NavSection>
        </CardHeader>
      </Card>
      
      {/* Rostering Section Card */}
      {(hasPermission('templates') || hasPermission('rosters') || hasPermission('birds-view') || hasPermission('timesheet-view')) && (
        <Card className="bg-gradient-to-r from-blue-500/5 to-sky-600/10 border-blue-500/20 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <NavSection
              title="Rostering"
              isOpen={openMenus['rostering']}
              onToggle={() => toggleMenu('rostering')}
              collapsed={isCollapsed}
              sectionColor="blue"
            >
              <div className="space-y-1 mt-2">
                {hasPermission('templates') && (
                  <NavItem
                    icon={<Workflow className="h-5 w-5" />}
                    label="Templates"
                    path="/templates"
                    active={isRouteActive('/templates')}
                    indent
                    sectionColor="blue"
                  />
                )}
                {hasPermission('rosters') && (
                  <NavItem
                    icon={<FileSpreadsheet className="h-5 w-5" />}
                    label="Rosters"
                    path="/rosters"
                    active={isRouteActive('/rosters')}
                    indent
                    sectionColor="blue"
                  />
                )}
                {hasPermission('birds-view') && (
                  <NavItem
                    icon={<PanelLeft className="h-5 w-5" />}
                    label="Birds View"
                    path="/birds-view"
                    active={isRouteActive('/birds-view')}
                    indent
                    sectionColor="blue"
                  />
                )}
                {hasPermission('timesheet-view') && (
                  <NavItem
                    icon={<Clock className="h-5 w-5" />}
                    label="Timesheet"
                    path="/timesheet"
                    active={isRouteActive('/timesheet')}
                    indent
                    sectionColor="blue"
                  />
                )}
              </div>
            </NavSection>
          </CardHeader>
        </Card>
      )}
      
      {/* Management Section Card */}
      {hasPermission('management') && (
        <Card className="bg-gradient-to-r from-green-500/5 to-emerald-600/10 border-green-500/20 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <NavSection
              title="Management"
              isOpen={openMenus['management']}
              onToggle={() => toggleMenu('management')}
              collapsed={isCollapsed}
              sectionColor="green"
            >
              <div className="space-y-1 mt-2">
                <NavItem
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Open Bids"
                  path="/management/bids"
                  active={isRouteActive('/management/bids')}
                  indent
                  sectionColor="green"
                />
                <NavItem
                  icon={<RefreshCw className="h-5 w-5" />}
                  label="Swap Requests"
                  path="/management/swaps"
                  active={isRouteActive('/management/swaps')}
                  indent
                  sectionColor="green"
                />
              </div>
            </NavSection>
          </CardHeader>
        </Card>
      )}
      
      {/* Additional Features Card */}
      {(hasPermission('broadcast') || hasPermission('insights') || hasPermission('configurations')) && (
        <Card className="bg-gradient-to-r from-amber-500/5 to-orange-600/10 border-amber-500/20 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="space-y-1">
              {hasPermission('broadcast') && (
                <NavItem
                  icon={<BellRing className="h-5 w-5" />}
                  label="Broadcast"
                  path="/broadcast"
                  active={isRouteActive('/broadcast')}
                  sectionColor="amber"
                />
              )}
              
              {hasPermission('insights') && (
                <NavItem
                  icon={<TrendingUp className="h-5 w-5" />}
                  label="Insights"
                  path="/insights"
                  active={isRouteActive('/insights')}
                  sectionColor="amber"
                />
              )}
              
              {hasPermission('configurations') && (
                <NavItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Configurations"
                  path="/configurations"
                  active={isRouteActive('/configurations')}
                  sectionColor="amber"
                />
              )}
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default NavigationLinks;
