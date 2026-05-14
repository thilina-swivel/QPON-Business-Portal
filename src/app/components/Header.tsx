import React, { useState } from 'react';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateToProfile: () => void;
  onLogout?: () => void;
  merchantName: string;
  planName: string;
}

export function Header({ 
  isDarkMode, 
  onToggleDarkMode, 
  onNavigateToProfile,
  onLogout,
  merchantName,
  planName
}: HeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
    <header className="h-16 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#2A2A2A] shadow-sm dark:shadow-lg sticky top-0 z-20 hidden lg:flex items-center justify-end px-6 gap-3 transition-colors duration-300">
      {/* Dark/Light Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleDarkMode}
        className="rounded-full bg-gray-50 dark:bg-[#1C1C1C] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-gray-600 dark:text-yellow-300" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-blue-300" />
        )}
      </Button>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer border border-gray-200 dark:border-[#2A2A2A] dark:bg-[#141414]"
            aria-label="Profile menu"
          >
            <div className="bg-gradient-to-br from-[#E35000] to-[#FF8000] p-2 rounded-full shadow-md dark:shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-[#0E2250] dark:text-white truncate max-w-[150px]">
                {merchantName}
              </p>
              <p className="text-xs text-gray-500 dark:text-blue-200/70 truncate max-w-[150px]">
                {planName}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] dark:shadow-2xl">
          <DropdownMenuLabel>
            <div>
              <p className="font-semibold text-[#0E2250] dark:text-white">{merchantName}</p>
              <p className="text-xs text-gray-500 dark:text-blue-200/70 font-normal mt-0.5">{planName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#2A2A2A]" />
          <DropdownMenuItem 
            onClick={onNavigateToProfile}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-blue-100"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {onLogout && (
            <>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#2A2A2A]" />
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-blue-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>

    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
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
          <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className="flex-1 text-sm border-gray-300 dark:border-[#2A2A2A] dark:text-white dark:hover:bg-white/10">
            Cancel
          </Button>
          <Button
            onClick={() => { setShowLogoutDialog(false); onLogout?.(); }}
            className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}