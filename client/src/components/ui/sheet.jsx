import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

function Sheet(props) {
  return <Dialog {...props} />;
}
function SheetTrigger(props) {
  return <DialogTrigger {...props} />;
}
function SheetContent({ side = 'right', className = '', children, ...props }) {
  const sideClasses = {
    right: 'right-0 top-0 h-full w-[min(92vw,24rem)] translate-x-0 translate-y-0 rounded-none border-l border-white/10',
    left: 'left-0 top-0 h-full w-[min(92vw,24rem)] translate-x-0 translate-y-0 rounded-none border-r border-white/10',
  };
  return (
    <DialogContent className={`${sideClasses[side]} ${className}`} {...props}>
      {children}
    </DialogContent>
  );
}
function SheetHeader(props) {
  return <DialogHeader {...props} />;
}
function SheetTitle(props) {
  return <DialogTitle {...props} />;
}
function SheetDescription(props) {
  return <DialogDescription {...props} />;
}

export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger };