import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function Dialog({ ...props }) {
  return <DialogPrimitive.Root {...props} />;
}
function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger {...props} />;
}
function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal {...props} />;
}
function DialogOverlay({ className, ...props }) {
  return <DialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-black/70 backdrop-blur-sm', className)} {...props} />;
}
function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content className={cn('fixed left-[50%] top-[50%] z-50 w-[min(92vw,38rem)] translate-x-[-50%] translate-y-[-50%] rounded-3xl border border-white/10 bg-[#0a1020] p-6 shadow-glow outline-none', className)} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-white/10 hover:text-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
function DialogHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />;
}
function DialogFooter({ className, ...props }) {
  return <div className={cn('mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)} {...props} />;
}
function DialogTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn('text-xl font-semibold tracking-tight', className)} {...props} />;
}
function DialogDescription({ className, ...props }) {
  return <DialogPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger };