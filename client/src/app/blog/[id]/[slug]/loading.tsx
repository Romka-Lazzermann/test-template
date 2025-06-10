
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArticleLoading() {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Main Article Content Skeleton */}
      <div className="lg:col-span-8 space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <header className="space-y-4">
          <Skeleton className="h-6 w-1/4 rounded-md bg-muted/50" /> {/* Category Badge */}
          <Skeleton className="h-10 w-full rounded-md bg-muted/50" /> {/* Title Line 1 */}
          <Skeleton className="h-8 w-3/4 rounded-md bg-muted/50" /> {/* Title Line 2 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Skeleton className="h-5 w-1/3 rounded-md bg-muted/50" /> {/* Author */}
            <Skeleton className="h-5 w-1/4 rounded-md bg-muted/50" /> {/* Date */}
          </div>
        </header>

        <Skeleton className="relative w-full h-64 md:h-80 lg:h-96 rounded-md bg-muted/50" /> {/* Image */}

        <div className="space-y-4 mt-6">
          <Skeleton className="h-6 w-full rounded-md bg-muted/50" />
          <Skeleton className="h-6 w-full rounded-md bg-muted/50" />
          <Skeleton className="h-6 w-5/6 rounded-md bg-muted/50" />
          <Skeleton className="h-6 w-full rounded-md bg-muted/50" />
          <Skeleton className="h-6 w-3/4 rounded-md bg-muted/50" />
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <aside className="lg:col-span-4 space-y-8">
        <Card className="shadow-lg bg-card border-border">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-3/4 rounded-md bg-muted/50" /> {/* Recent Articles Title */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                  <Skeleton className="h-5 w-full rounded-md mb-1 bg-muted/50" /> {/* Recent Article Title */}
                  <Skeleton className="h-4 w-1/2 rounded-md bg-muted/50" /> {/* Recent Article Date */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
