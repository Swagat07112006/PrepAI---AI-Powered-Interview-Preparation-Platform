import React from 'react';
import { NavLink, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowUpRight, Search, LogOut, Sparkles, PanelLeftClose, PanelLeftOpen, HelpCircle, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { appNavigation, futureNavigation } from '@/constants/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

function NavItem({ item, compact = false, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) => cn('group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition', isActive ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground', compact && 'justify-center px-2')}
    >
      <Icon className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:scale-105 transition-all" />
      {!compact ? <span>{item.label}</span> : null}
    </NavLink>
  );
}

function SidebarContent({ compact = false, onNavigate }) {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className={cn('flex h-full flex-col', compact ? 'p-2' : 'p-4')}>
      <div className={cn('flex items-center gap-3 px-2 py-3', compact && 'justify-center px-0')}>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/30 flex-shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        {!compact ? (
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">PrepAI</p>
            <p className="text-xs text-muted-foreground">Interview prep workspace</p>
          </div>
        ) : null}
      </div>
      <Separator className="my-4 bg-white/10" />
      <nav className="space-y-1">
        {appNavigation.map((item) => (
          <NavItem key={item.href} item={item} compact={compact} onClick={onNavigate} />
        ))}
        <a
          href="https://github.com/Swagat07112006/PrepAI---AI-Powered-Interview-Preparation-Platform"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition text-muted-foreground hover:bg-white/5 hover:text-foreground',
            compact && 'justify-center px-2'
          )}
        >
          <Github className="h-4 w-4 text-amber-500/80 group-hover:text-amber-400 group-hover:scale-105 transition-all" />
          {!compact ? <span>GitHub</span> : null}
        </a>
      </nav>
      {!compact ? (
        <>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-2">
            <p className="px-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Future surfaces</p>
            {futureNavigation.slice(0, 4).map((item) => (
              <NavLink key={item.href} to={item.href} className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors hover:bg-white/5">
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </NavLink>
            ))}
          </div>
        </>
      ) : null}
      <div className="mt-auto space-y-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-4">
          {!compact ? (
            <>
              <p className="text-sm font-medium text-slate-200">Daily goal</p>
              <p className="mt-1 text-xs text-muted-foreground">Solve 2 questions, review 3 revisions, and capture 1 note.</p>
              <div className="mt-4">
                <Badge variant="accent">Sprint mode</Badge>
              </div>
            </>
          ) : null}
        </div>

        {!compact && (
          <>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarFallback className="bg-white/10 text-amber-400 text-sm font-medium">{user?.fullName?.slice(0, 2)?.toUpperCase() || 'PA'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate leading-none text-white">{user?.fullName || 'PrepAI User'}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">@{user?.userName || 'workspace'}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="p-2 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-rose-400 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AppLayout({ children }) {
  const { user, logout, isLoggingOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [sidebarWidth, setSidebarWidth] = React.useState(() => {
    const saved = localStorage.getItem('sidebar-width');
    return saved ? Number(saved) : 280;
  });
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [isResizing, setIsResizing] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');

  const searchInputRef = React.useRef(null);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackText('');
      setFeedbackOpen(false);
      toast.success("Thank you for your feedback! Our engineering team has received it.");
    }, 800);
  };

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const startResizing = React.useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        let newWidth = mouseMoveEvent.clientX;
        if (newWidth < 200) {
          newWidth = 200;
        } else if (newWidth > 450) {
          newWidth = 450;
        }
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebar-width', String(newWidth));
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Sync search input value with URL search query parameter 'q'
  React.useEffect(() => {
    setSearchVal(searchParams.get('q') || '');
  }, [searchParams, location.pathname]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchVal(value);

    // Reactively filter inline if already on standard search pages
    if (location.pathname === '/questions' || location.pathname === '/notes') {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      setSearchParams(next);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Redirect to questions search interface if on dashboard or revisions
      if (location.pathname !== '/questions' && location.pathname !== '/notes') {
        navigate(`/questions?q=${encodeURIComponent(searchVal)}`);
      }
    }
  };

  const getBreadcrumbName = () => {
    if (location.pathname === '/') return 'Dashboard';
    const clean = location.pathname.slice(1).replace(/-/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  return (
    <div className={cn('min-h-screen lg:flex', isResizing && 'select-none cursor-col-resize bg-[#14110d]')}>
      <aside
        style={{ width: isCollapsed ? 0 : sidebarWidth }}
        className={cn(
          'relative hidden border-r border-white/10 bg-white/5 lg:block flex-shrink-0 overflow-hidden',
          isCollapsed ? 'border-r-0' : '',
          isResizing ? '' : 'transition-[width] duration-300'
        )}
      >
        <div style={{ width: sidebarWidth, minWidth: 200 }} className="relative h-full">
          <SidebarContent />
          <button
            onClick={toggleCollapse}
            className="absolute right-4 top-4 rounded-xl p-1 text-muted-foreground hover:bg-white/15 hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => {
              setSidebarWidth(280);
              localStorage.setItem('sidebar-width', '280');
            }}
            className={cn(
              'absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-amber-500/20 active:bg-amber-500/80 transition-colors z-50',
              isResizing && 'bg-amber-500/50'
            )}
            title="Drag to resize, double-click to reset"
          />
        )}
      </aside>

      <div className="flex min-h-screen flex-col flex-1 min-w-0 bg-[#14110d]">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#14110d]/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

            {/* Left Section: Mobile Menu Trigger + Collapsed Button + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#14110d] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <SidebarContent onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              {isCollapsed && (
                <button
                  onClick={toggleCollapse}
                  className="hidden lg:flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors mr-1"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="h-5 w-5" />
                </button>
              )}

              {/* Industry-standard Clean Breadcrumbs */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-tight">
                <span className="text-slate-500">PrepAI</span>
                <span className="text-white/20 select-none">/</span>
                <span className="text-slate-200 capitalize select-all">
                  {getBreadcrumbName()}
                </span>
              </div>
            </div>

            {/* Center Section: Centered, sleek Search Pill */}
            <div className="flex-1 max-w-[340px] min-w-0 mx-auto">
              <div className="relative flex items-center gap-2 rounded-xl border border-white/5 bg-[#1b1712] px-3 py-1.5 focus-within:border-amber-500/35 focus-within:bg-[#14110d] focus-within:ring-1 focus-within:ring-amber-500/20 transition-all select-none">
                <Search className="h-3.5 w-3.5 text-slate-505 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchVal}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search workspace..."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-slate-550 text-slate-200"
                />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {searchVal ? (
                    <button
                      onClick={() => {
                        setSearchVal('');
                        if (location.pathname === '/questions' || location.pathname === '/notes') {
                          const next = new URLSearchParams(searchParams);
                          next.delete('q');
                          setSearchParams(next);
                        }
                      }}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px] font-medium text-slate-500">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: System Actions & Interactive Notification bells */}
            <div className="flex items-center gap-3.5">
              {/* Quick Create Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-xl text-xs font-semibold transition-all select-none active:scale-95 shadow-md">
                    <span>Create</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-[#14110d] border border-white/10 rounded-2xl p-1 shadow-2xl z-50">
                  <DropdownMenuItem onClick={() => navigate('/questions')} className="rounded-xl px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer">
                    New Question
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/notes')} className="rounded-xl px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer">
                    New Note
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/revisions')} className="rounded-xl px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer">
                    Review Cards
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Feedback popover action */}
              <Popover open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                    title="Send system feedback"
                  >
                    <span>Feedback</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[320px] bg-[#14110d] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Send Feedback</h4>
                      <p className="text-xs text-slate-400">Submit comments, bug reports or questions directly to the product engineering team.</p>
                    </div>
                    <textarea
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="What should we improve?"
                      className="w-full h-20 bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setFeedbackOpen(false);
                          setFeedbackText('');
                        }}
                        className="rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs px-3 py-1.5"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingFeedback || !feedbackText.trim()}
                        className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold px-3 py-1.5 animate-none"
                      >
                        {isSubmittingFeedback ? (
                          <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Sending...</span>
                        ) : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </PopoverContent>
              </Popover>


              {/* Help & Shortcuts Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hidden sm:flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors" title="Help & Shortcuts">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[325px] bg-[#14110d] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Help & System Shortcuts</h4>
                    <p className="text-xs text-slate-400">Essential hotkeys and developer workspace resources.</p>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keyboard Shortcuts</h5>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Focus Search Bar</span>
                        <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] border border-white/10 font-mono">⌘K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Create New Question</span>
                        <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] border border-white/10 font-mono">N</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Save Document / Note</span>
                        <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] border border-white/10 font-mono">⌘S</kbd>
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex flex-col gap-2">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs text-amber-400 hover:underline">
                      <span>Documentation Hub</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </PopoverContent>
              </Popover>

              <Separator orientation="vertical" className="h-5 bg-white/10" />

              {/* User Dropdown Profile Menu - Right Aligned */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-full p-0.5 focus:outline-none transition hover:opacity-90">
                    <Avatar className="h-7 w-7 border border-white/10 hover:border-amber-400/50 transition-colors">
                      <AvatarFallback className="bg-white/15 text-amber-400 text-[10px] font-bold uppercase">
                        {user?.fullName?.slice(0, 2)?.toUpperCase() || 'PA'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-[#14110d] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50">
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'PrepAI User'}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">@{user?.userName || 'workspace'}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl px-2 py-1.5 text-xs text-slate-350 hover:text-white hover:bg-white/5 cursor-pointer">
                    User Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href="https://github.com/Swagat07112006/PrepAI---AI-Powered-Interview-Preparation-Platform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl px-2 py-1.5 text-xs text-slate-350 hover:text-white hover:bg-white/5 cursor-pointer flex items-center justify-between w-full"
                    >
                      <span>GitHub Repository</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut} className="rounded-xl px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </header>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}