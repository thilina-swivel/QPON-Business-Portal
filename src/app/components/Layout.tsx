import React from 'react';
import { LayoutDashboard, Users, BarChart3, CreditCard, Menu, X, User, Moon, Sun, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import logoImage from '../../assets/logo.png';
import { Header } from './Header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout?: () => void;
  onShowGuide?: () => void;
}

export function Layout({ children, currentView, onChangeView, onLogout, onShowGuide }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showMobileLogoutDialog, setShowMobileLogoutDialog] = React.useState(false);
  const [isCollapsed] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem('qp_dark_mode');
    return savedMode === 'true';
  });
  const merchantData = {
    name: 'Axora Technologies',
    planName: 'Gold Plan · 500 Seats'
  };

  // Apply dark class to document root
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Persist to localStorage
    localStorage.setItem('qp_dark_mode', newMode.toString());
  };

  const navItems = [
    { id: 'hr-dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
    { id: 'hr-employees', label: 'Employees', icon: Users, disabled: false },
    { id: 'hr-analytics', label: 'Analytics', icon: BarChart3, disabled: false },
    { id: 'hr-billing', label: 'Billing', icon: CreditCard, disabled: false },
  ];

  const NavItem = ({ item, isMobile = false }: { item: typeof navItems[0]; isMobile?: boolean }) => {
    const isActive = currentView === item.id;
    const btn = (
      <button
        id={`nav-item-${item.id}`}
        key={item.id}
        disabled={item.disabled}
        onClick={() => {
          if (item.disabled) return;
          onChangeView(item.id);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className={cn(
          "flex items-center w-full py-3 text-sm font-medium transition-all duration-200 relative group/navitem",
          isCollapsed && !isMobile ? "px-0 justify-center" : "px-6",
          isActive && !item.disabled
            ? "text-[#E35000] bg-white/10 border-r-4 border-[#E35000]"
            : item.disabled
            ? "text-gray-600 cursor-not-allowed opacity-50"
            : "text-gray-300 hover:text-white hover:bg-white/5"
        )}
      >
        <span className="relative flex-shrink-0">
          <item.icon className={cn(
            "w-5 h-5 transition-colors",
            isCollapsed && !isMobile ? "" : "mr-3",
            isActive && !item.disabled ? "text-[#E35000]" : item.disabled ? "text-gray-600" : "text-gray-400 group-hover/navitem:text-white"
          )} />
        </span>
        {(!isCollapsed || isMobile) && (
          <span className="flex-1 text-left">{item.label}</span>
        )}
        {(!isCollapsed || isMobile) && item.disabled && (
          <span className="text-[10px] text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">Soon</span>
        )}
      </button>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 text-xs">
            {item.label}{item.disabled ? ' (Coming soon)' : ''}
          </TooltipContent>
        </Tooltip>
      );
    }
    return btn;
  };

  const NavContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      {!isMobile && (
        <div className="flex flex-col items-start justify-center h-20 border-b border-gray-800/30 gap-1 px-6">
          <img src={logoImage} alt="QPON.lk" className="h-8 w-auto" />
          <p className="text-[9px] text-gray-500 font-medium tracking-widest uppercase">Business Portal</p>
        </div>
      )}

      {/* Nav Items */}
      <nav className={cn("flex-1 py-6 space-y-1", isMobile ? "px-4" : "")}>
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} isMobile={isMobile} />
        ))}

      </nav>

      {/* Bottom section: Guide + Logout */}
      <div className={cn("mt-auto space-y-3", isCollapsed && !isMobile ? "p-2" : isMobile ? "p-4" : "p-4")}>

        {/* Getting Started guide button */}
        {!isMobile && (
          <button
            onClick={onShowGuide}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>Getting Started</span>
          </button>
        )}

        {/* Logout button — mobile only */}
        {onLogout && isMobile && (
          <button
            onClick={() => { setIsMobileMenuOpen(false); setShowMobileLogoutDialog(true); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-xs font-medium"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Log Out</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={100}>
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex font-sans transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block bg-[#0E2250] dark:bg-[#0A0A0A] shadow-xl fixed h-full z-30 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0E2250] dark:bg-[#0A0A0A] z-40 h-16 flex items-center justify-between px-4 shadow-md transition-colors duration-300">
        <img src={logoImage} alt="QPON.lk" className="h-8 w-auto" />
        <div className="flex items-center gap-1">
          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleDarkMode}
            className="rounded-full hover:bg-white/10 transition-colors w-10 h-10 flex items-center justify-center flex-shrink-0"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </Button>
          
          {/* Merchant Avatar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChangeView('hr-settings');
              setIsMobileMenuOpen(false);
            }}
            className="rounded-full hover:bg-white/10 transition-colors w-10 h-10 flex items-center justify-center flex-shrink-0"
            aria-label="Settings"
          >
            <User className="h-5 w-5 text-white" />
          </Button>
          {/* Hamburger Menu */}
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:bg-white/10 ext-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-[35] backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-[36] bg-[#0E2250] dark:bg-[#0A0A0A] overflow-y-auto transition-colors duration-300">
            <NavContent isMobile={true} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 pt-16 lg:pt-0 transition-all duration-300",
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Desktop Header */}
        <Header 
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onNavigateToProfile={() => onChangeView('hr-settings')}
          onLogout={onLogout}
          merchantName={merchantData.name}
          planName={merchantData.planName}
        />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {!isMobileMenuOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#2A2A2A] z-40 flex justify-around items-center py-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "flex flex-col items-center p-2 text-xs font-medium transition-colors flex-1",
                  isActive ? "text-[#0E2250] dark:text-white" : "text-gray-400 dark:text-blue-300/60"
                )}
              >
                <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-[#E35000]" : "text-gray-400 dark:text-blue-300/60")} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Logout Confirmation Dialog */}
      <Dialog open={showMobileLogoutDialog} onOpenChange={setShowMobileLogoutDialog}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <DialogTitle className="text-[#0E2250] dark:text-white">Log Out?</DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed py-1">
            Are you sure you want to log out of your QPON Business Portal account?
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowMobileLogoutDialog(false)} className="flex-1 text-sm border-gray-300 dark:border-[#2A2A2A] dark:text-white dark:hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={() => { setShowMobileLogoutDialog(false); onLogout?.(); }}
              className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}