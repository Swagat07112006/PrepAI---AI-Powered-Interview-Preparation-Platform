import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root className={cn(className)} {...props} />;
}
function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn('inline-flex h-11 items-center rounded-full border border-white/10 bg-white/5 p-1 text-muted-foreground', className)} {...props} />;
}
function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Trigger className={cn('inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...props} />;
}
function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-4 outline-none', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };