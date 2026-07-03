import { cn } from '@/lib/utils';

function Table({ className, ...props }) {
  return <div className={cn('w-full overflow-auto rounded-3xl border border-white/10 bg-white/5', className)} {...props} />;
}
function TableElement({ className, ...props }) {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />;
}
function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b [&_tr]:border-white/10', className)} {...props} />;
}
function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
function TableRow({ className, ...props }) {
  return <tr className={cn('border-b border-white/10 transition-colors hover:bg-white/5', className)} {...props} />;
}
function TableHead({ className, ...props }) {
  return <th className={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground', className)} {...props} />;
}
function TableCell({ className, ...props }) {
  return <td className={cn('p-4 align-middle', className)} {...props} />;
}

export { Table, TableElement as Table, TableBody, TableCell, TableHead, TableHeader, TableRow };