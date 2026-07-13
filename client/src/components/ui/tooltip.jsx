import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 0, ...props }) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}
function Tooltip({ ...props }) {
  return <TooltipPrimitive.Root {...props} />;
}
function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Trigger {...props} />;
}
function TooltipContent({ className, sideOffset = 8, ...props }) {
  return <TooltipPrimitive.Portal><TooltipPrimitive.Content sideOffset={sideOffset} className={cn('z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#14110d] px-3 py-2 text-xs text-foreground shadow-glow', className)} {...props} /></TooltipPrimitive.Portal>;
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };