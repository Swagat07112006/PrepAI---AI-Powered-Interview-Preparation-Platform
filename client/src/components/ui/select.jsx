import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function Select({ ...props }) {
  return <SelectPrimitive.Root {...props} />;
}
function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger className={cn('flex h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background', className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild><ChevronDown className="h-4 w-4 opacity-70" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
}
function SelectContent({ className, children, position = 'popper', ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn('z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1020] shadow-glow', className)} position={position} {...props}>
        <SelectPrimitive.Viewport className="p-2">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item className={cn('relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition hover:bg-white/8 focus:bg-white/8', className)} {...props}>
      <span className="absolute left-3 inline-flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };