import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Avatar, AvatarFallback } from '../ui/avatar.jsx';
import { Badge } from '../ui/badge.jsx';
import { Receipt, LogOut, ChevronDown, Globe } from 'lucide-react';
import { translate } from '../../lib/translate.js';

export function Header({ language, setLanguage }) {
  const { user, logout, switchRole } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
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

  const handleRoleChange = (role) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const getRoleTranslation = (role) => {
    switch (role) {
      case 'User':
        return 'User';
      case 'Supervisor':
        return 'Supervisor';
      case 'Finance Approver':
        return 'Finance Approver';
      case 'Super Admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-blue-600">Claim Reimbursement App</h1>
            <p className="text-sm text-gray-500">Submit and manage your claims easily.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">{translate(language, 'languages.' + language)}</span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-[100]">
                {['en', 'hi', 'es', 'fr'].map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => handleLanguageChange(langKey)}
                    className={`w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm ${language === langKey ? 'bg-accent' : ''}`}
                  >
                    {translate(language, 'languages.' + langKey)}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                <button onClick={() => handleRoleChange('User')} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm">User</button>
                <button onClick={() => handleRoleChange('Supervisor')} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm">Supervisor</button>
                <button onClick={() => handleRoleChange('Finance Approver')} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm">Finance Approver</button>
                <button onClick={() => handleRoleChange('Super Admin')} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm">Super Admin</button>
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
                <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm">{`${user.firstName} ${user.lastName}`}</div>
                <Badge variant={getRoleBadgeVariant()} className="text-xs mt-1">{getRoleTranslation(user.role)}</Badge>
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
                <button onClick={handleLogout} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm text-red-600 flex items-center gap-2">
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
}
