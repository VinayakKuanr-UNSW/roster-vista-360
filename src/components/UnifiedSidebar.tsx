
import React, { useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import LogoSection from './sidebar/LogoSection';
import NavigationLinks from './sidebar/NavigationLinks';
import UserSection from './sidebar/UserSection';

// Define allowed menu keys for better type safety
type MenuKey = 'workspace' | 'rostering' | 'management';

const UnifiedSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  
  // Use a typed state for open menus
  const [openMenus, setOpenMenus] = useState<Record<MenuKey, boolean>>({
    workspace: true, // Default open for better UX
    rostering: false,
    management: false,
  });
  
  const isCollapsed = state === "collapsed";
  
  const toggleMenu = useCallback((menu: MenuKey) => {
    if (isCollapsed) {
      // In collapsed state, toggle current menu and close others
      setOpenMenus(prev => {
        const newState: Record<MenuKey, boolean> = { ...prev };
        // Close all other menus
        (Object.keys(newState) as MenuKey[]).forEach(key => {
          if (key !== menu) newState[key] = false;
        });
        // Toggle the current menu
        newState[menu] = !prev[menu];
        return newState;
      });
    } else {
      // In expanded state, just toggle the menu
      setOpenMenus(prev => ({
        ...prev,
        [menu]: !prev[menu],
      }));
    }
  }, [isCollapsed]);
  
  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);
  
  const handleThemeChange = useCallback((newTheme: 'dark' | 'light' | 'glass' | 'lovable') => {
    setTheme(newTheme);
  }, [setTheme]);

  // Use memoization for the dynamic class string
  const sidebarWidth = useMemo(() => isCollapsed ? "w-[70px]" : "w-[280px]", [isCollapsed]);

  return (
    <motion.nav
      role="navigation"
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-md border-r border-border/50 shadow-xl transition-all duration-300 ease-in-out",
        sidebarWidth
      )}
      initial={false}
      animate={{ width: isCollapsed ? 70 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Logo Section Card */}
      <Card className="m-3 mb-2 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <LogoSection isCollapsed={isCollapsed} />
        </CardContent>
      </Card>

      {/* Main Navigation Card */}
      <Card className="mx-3 mb-2 flex-1 bg-card/60 backdrop-blur-sm border-border/30 shadow-md">
        <CardContent className="p-2 h-full flex flex-col">
          <NavigationLinks openMenus={openMenus} toggleMenu={toggleMenu} />
        </CardContent>
      </Card>

      {/* User Section Card */}
      <Card className="m-3 mt-2 bg-gradient-to-br from-muted/50 to-accent/20 border-border/40 shadow-lg">
        <CardContent className="p-0">
          <UserSection 
            user={user} 
            isCollapsed={isCollapsed}
            theme={theme}
            handleThemeChange={handleThemeChange}
            handleLogout={handleLogout}
          />
        </CardContent>
      </Card>
    </motion.nav>
  );
};

export default UnifiedSidebar;
