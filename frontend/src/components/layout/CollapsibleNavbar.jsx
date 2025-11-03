import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, CheckCircle, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const CollapsibleNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      label: 'My Claims',
      icon: Home,
      roles: ['User', 'Supervisor', 'Finance Approver', 'Super Admin'],
    },
    {
      path: '/approvals',
      label: 'Pending Approvals',
      icon: CheckCircle,
      roles: ['Supervisor', 'Finance Approver'],
    },
    {
      path: '/admin',
      label: 'Administration',
      icon: Settings,
      roles: ['Finance Approver', 'Super Admin'],
    },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(user.role));

  // Mobile version (overlay)
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button - Hidden when sidebar is open */}
        {!isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="fixed top-20 left-4 z-[60] md:hidden bg-white shadow-md hover:shadow-lg rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Backdrop with blur - Only covers content below header */}
        {isMobileOpen && (
          <div 
            className="fixed left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-[45]"
            style={{ top: '73px' }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar (Overlay) - Starts below header */}
        <div 
          className={`fixed left-0 bottom-0 bg-white border-r shadow-lg z-[50] transition-transform duration-300 ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '256px', top: '73px' }}
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2 mt-12">
            {visibleItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </>
    );
  }

  // Desktop version (original behavior)
  return (
    <div 
      className={`bg-white border-r transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ minHeight: 'calc(100vh - 73px)' }}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h3 className="text-gray-700">Navigation</h3>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}


