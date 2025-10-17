import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Receipt, LogOut, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const getRoleBadgeVariant = () => {
    switch (user.role) {
      case 'Super Admin':
        return 'default';
      case 'Finance Approver':
        return 'secondary';
      case 'Supervisor':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
    <div className="px-4 py-4 flex items-center justify-between">
        {/* Left Corner: clAImify Logo and Title */}
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-blue-600">clAImify</h1>
                {/* <p className="text-sm text-gray-500">Reimbursement Management</p> */}
            </div>
        </div>

        {/* Right Corner: Role Switcher and User Profile */}
        <div className="flex items-center gap-4">
            {/* Role Switcher for Demo */}
            <div className="relative" ref={roleDropdownRef}>
                <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 transition-colors"
                >
                    Switch Role <ChevronDown className="h-4 w-4" />
                </button>
                
                {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[100]">
                        <div className="px-2 py-1.5 text-sm">Demo: Switch Role</div>
                        <div className="h-px bg-border my-1" />
                        <button
                            onClick={() => handleRoleChange('User')}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        >
                            User
                        </button>
                        <button
                            onClick={() => handleRoleChange('Supervisor')}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        >
                            Supervisor
                        </button>
                        <button
                            onClick={() => handleRoleChange('Finance Approver')}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        >
                            Finance Approver
                        </button>
                        <button
                            onClick={() => handleRoleChange('Super Admin')}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        >
                            Super Admin
                        </button>
                    </div>
                )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileDropdownRef}>
                <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md text-sm hover:bg-accent hover:text-accent-foreground h-10 px-2 transition-colors"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                        <div className="text-sm">{`${user.firstName} ${user.lastName}`}</div>
                        <Badge variant={getRoleBadgeVariant()} className="text-xs mt-1">
                            {user.role}
                        </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border z-[100]">
                        <div className="px-2 py-1.5 text-sm">My Account</div>
                        <div className="h-px bg-border my-1" />
                        <div className="px-2 py-2 text-sm text-gray-600">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">Email</p>
                                <p>{user.email}</p>
                            </div>
                            <div className="space-y-1 mt-2">
                                <p className="text-xs text-gray-500">Entity</p>
                                <p>{user.entity}</p>
                            </div>
                            <div className="space-y-1 mt-2">
                                <p className="text-xs text-gray-500">Department</p>
                                <p>{user.department}</p>
                            </div>
                        </div>
                        <div className="h-px bg-border my-1" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm text-red-600 flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
</header>
  );
};
