import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Home, CheckCircle, Settings, FileText } from 'lucide-react';

export function Navigation() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (!user) return null;
  const isActive = (path) => location.pathname === path;
  const navItems = [
    { path: '/', label: 'My Claims', icon: Home, roles: ['User', 'Supervisor', 'Finance Approver', 'Super Admin'] },
    { path: '/approvals', label: 'Pending Approvals', icon: CheckCircle, roles: ['Supervisor', 'Finance Approver'] },
    { path: '/admin', label: 'Administration', icon: Settings, roles: ['Finance Approver', 'Super Admin'] },
  ];
  const visibleItems = navItems.filter(item => item.roles.includes(user.role));
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                onClick={() => navigate(item.path)}
                className="gap-2 whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
