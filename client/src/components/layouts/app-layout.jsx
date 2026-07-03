import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, ArrowUpRight, Search, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { appNavigation, futureNavigation } from '@/constants/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

function NavItem({ item, compact = false, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) => cn('group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition', isActive ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground', compact && 'justify-center px-2')}
    >
      <Icon className="h-4 w-4" />
      {!compact ? <span>{item.label}</span> : null}
    </NavLink>
  );
}

function SidebarContent({ compact = false, onNavigate }) {
  return (
    <div className={cn('flex h-full flex-col', compact ? 'p-2' : 'p-4')}>
      <div className={cn('flex items-center gap-3 px-2 py-3', compact && 'justify-center px-0')}>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-[#07111d] shadow-lg shadow-cyan-500/30">
          <Sparkles className="h-5 w-5" />
        </div>
        {!compact ? (
          <div>
            <p className="text-sm font-semibold tracking-wide">PrepAI</p>
            <p className="text-xs text-muted-foreground">Interview prep workspace</p>
          </div>
        ) : null}
      </div>
      <Separator className="my-4 bg-white/10" />
      <nav className="space-y-1">
        {appNavigation.map((item) => (
          <NavItem key={item.href} item={item} compact={compact} onClick={onNavigate} />
        ))}
      </nav>
      {!compact ? (
        <>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-2">
            <p className="px-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Future surfaces</p>
            {futureNavigation.slice(0, 4).map((item) => (
              <NavLink key={item.href} to={item.href} className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            ))}
          </div>
        </>
      ) : null}
      <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-4">
        {!compact ? (
          <>
            <p className="text-sm font-medium">Daily goal</p>
            <p className="mt-1 text-sm text-muted-foreground">Solve 2 questions, review 3 revisions, and capture 1 note.</p>
            <div className="mt-4">
              <Badge variant="accent">Sprint mode</Badge>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function AppLayout({ children }) {
  const location = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-white/5 lg:block">
        <SidebarContent />
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a1020]/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#07111f] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input aria-label="Search workspace" placeholder="Search questions, notes, revisions..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Badge variant="success">{user?.role || 'User'}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left transition hover:bg-white/10">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{user?.fullName?.slice(0, 2)?.toUpperCase() || 'P'}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium leading-none">{user?.fullName || 'PrepAI User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.userName ? `@${user.userName}` : 'workspace account'}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><NavLink to="/profile">Profile</NavLink></DropdownMenuItem>
                  <DropdownMenuItem asChild><NavLink to="/settings">Settings</NavLink></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex-1">
          {children}
        </motion.div>
      </div>
    </div>
  );
}