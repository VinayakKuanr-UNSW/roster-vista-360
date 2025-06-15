
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FolderKanban, UserCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavSectionProps } from './types';

const NavSection: React.FC<NavSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  collapsed,
  sectionColor = "primary"
}) => {
  const colorClass = sectionColor === "primary" ? "text-primary" : `text-${sectionColor}-500`;
  
  // Get section icon based on title
  const getSectionIcon = () => {
    switch (title.toLowerCase()) {
      case "my workspace":
        return <UserCircle2 className={cn("h-4 w-4", colorClass)} />;
      case "rostering":
        return <FolderKanban className={cn("h-4 w-4", colorClass)} />;
      case "management":
        return <Shield className={cn("h-4 w-4", colorClass)} />;
      default:
        return <FolderKanban className={cn("h-4 w-4", colorClass)} />;
    }
  };
  
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center w-full px-2 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 justify-between group",
                "bg-gradient-to-r from-transparent to-white/5"
              )}
            >
              {/* Left Side: Icon + Label */}
              <div className="flex items-center gap-2">
                {getSectionIcon()}
                {!collapsed && (
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    colorClass
                  )}>
                    {title}
                  </span>
                )}
              </div>
              
              {/* Right Side: Chevron (only if not collapsed) */}
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-all duration-200 group-hover:scale-110",
                    isOpen && "transform rotate-180",
                    colorClass
                  )}
                />
              )}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{title}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      
      {/* Sub-menu when expanded and not collapsed */}
      {!collapsed && (
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0 
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="border-l-2 border-current/20 ml-2 pl-2 mt-1" style={{ borderColor: `var(--${sectionColor})` }}>
            {children}
          </div>
        </motion.div>
      )}
      
      {/* Collapsed sub-menu items (for quick hover) */}
      {collapsed && isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-1 mt-1"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default NavSection;
