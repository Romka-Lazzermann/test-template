import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function SearchLoading() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-12 w-1/2 mx-auto mb-6 rounded-md" /> {/* Page Title */}
        {/* SearchBar Skeleton */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-card rounded-lg shadow">
          <Skeleton className="h-10 flex-grow rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden flex flex-col md:flex-row">
            <Skeleton className="md:w-1/3 h-48 md:h-auto w-full rounded-none md:rounded-l-lg md:rounded-r-none" /> {/* Image */}
            <div className="md:w-2/3 flex flex-col">
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-1/4 mb-1 rounded-md" /> {/* Category */}
                <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-4 w-1/3 rounded-md" /> {/* Author */}
                <Skeleton className="h-4 w-1/4 rounded-md" /> {/* Date */}
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
