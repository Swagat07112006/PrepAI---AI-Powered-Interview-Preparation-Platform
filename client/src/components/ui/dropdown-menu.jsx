import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

function DropdownMenu({ ...props }) {
  return <DropdownMenuPrimitive.Root {...props} />;
}
function DropdownMenuTrigger({ ...props }) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}
function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content sideOffset={sideOffset} className={cn('z-50 min-w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#14110d] p-2 shadow-glow outline-none', className)} {...props} /></DropdownMenuPrimitive.Portal>;
}
function DropdownMenuItem({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : DropdownMenuPrimitive.Item;
  return <Comp className={cn('flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition hover:bg-white/8 focus:bg-white/8', className)} {...props} />;
}
function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator className={cn('my-2 h-px bg-white/10', className)} {...props} />;
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger };