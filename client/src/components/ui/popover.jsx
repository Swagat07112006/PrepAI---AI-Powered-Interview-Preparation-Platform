import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

function Popover({ ...props }) {
  return <PopoverPrimitive.Root {...props} />;
}
function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger {...props} />;
}
function PopoverContent({ className, sideOffset = 8, ...props }) {
  return <PopoverPrimitive.Portal><PopoverPrimitive.Content sideOffset={sideOffset} className={cn('z-50 w-80 rounded-3xl border border-white/10 bg-[#0a1020] p-4 shadow-glow outline-none', className)} {...props} /></PopoverPrimitive.Portal>;
}

export { Popover, PopoverContent, PopoverTrigger };