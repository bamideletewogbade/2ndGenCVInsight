import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}