
import { ReactNode } from 'react';

export type SectionColor = "primary" | "purple" | "blue" | "green" | "amber";

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  indent?: boolean;
  sectionColor?: SectionColor;
}

export interface NavSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  collapsed: boolean;
  sectionColor?: SectionColor;
}

export interface ThemeToggleProps {
  isCollapsed: boolean;
  theme: 'dark' | 'light' | 'glass' | 'lovable';
  handleThemeChange: (theme: 'dark' | 'light' | 'glass' | 'lovable') => void;
}

export interface UserProfileProps {
  user: any;
  isCollapsed: boolean;
  handleLogout: () => void;
}

export interface NotificationProps {
  isCollapsed?: boolean;
}
