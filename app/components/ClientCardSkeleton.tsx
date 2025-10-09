import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientCardSkeleton() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Skeleton className="w-full h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-4/5 h-4 mb-2" />
        <Skeleton className="w-3/5 h-4 mb-2" />
        <Skeleton className="w-2/5 h-4" />
      </CardContent>
      <CardFooter className="flex-col justify-start gap-2">
        <Skeleton className="w-1/2 h-4" />
      </CardFooter>
    </Card>
  );
}
