
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from "lucide-react";

export default function CategoryLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-40 rounded-md" /> {/* Back Button Skeleton */}
      </div>

      <header className="bg-card p-6 rounded-lg shadow-md text-center">
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md" /> {/* Category Title Skeleton */}
      </header>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden flex flex-col md:flex-row bg-card border-border">
            <Skeleton className="md:w-1/4 h-40 md:h-auto w-full rounded-none md:rounded-l-lg md:rounded-r-none" /> {/* Image Skeleton */}
            <div className="md:w-3/4 flex flex-col flex-grow">
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-1/4 mb-2 rounded-md bg-muted/50" /> {/* Category Badge Skeleton */}
                <Skeleton className="h-6 w-3/4 rounded-md bg-muted/50" /> {/* Title Skeleton */}
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <Skeleton className="h-4 w-full rounded-md mb-2 bg-muted/50" />
                <Skeleton className="h-4 w-full rounded-md mb-2 bg-muted/50" />
                <Skeleton className="h-4 w-2/3 rounded-md bg-muted/50" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-4 w-1/3 rounded-md bg-muted/50" /> {/* Author Skeleton */}
                <Skeleton className="h-4 w-1/4 rounded-md bg-muted/50" /> {/* Date Skeleton */}
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
