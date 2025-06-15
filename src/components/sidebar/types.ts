
export interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  badge?: string | number;
  children?: NavItemProps[];
  isCollapsed: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export interface NavSectionProps {
  title: string;
  items: NavItemProps[];
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface ThemeToggleProps {
  isCollapsed: boolean;
  theme: 'dark' | 'light' | 'glass' | 'lovable';
  handleThemeChange: (theme: 'dark' | 'light' | 'glass' | 'lovable') => void;
}
