'use client';

import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/dashboard',
  },
  {
    label: 'Investor',
    icon: <GroupIcon />,
    href: '/dashboard/investor',
  },
  {
    label: 'Financial',
    icon: <AccountBalanceIcon />,
    href: '/dashboard/financial',
  },
  {
    label: 'Ownership',
    icon: <SellIcon />,
    href: '/dashboard/ownership',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    href: '/dashboard/settings',
  },
];

/**
 * Sidebar navigation component
 */
export const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          top: 70,
          left: 16,
          zIndex: 1200,
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? 240 : 80,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 80,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            marginTop: '64px',
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link href={item.href} style={{ width: '100%', textDecoration: 'none' }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};