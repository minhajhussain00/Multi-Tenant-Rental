import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ActivityCard({
  title,
  bookings,
  emptyText,
}: {
  title: string;
  bookings: any[];
  emptyText: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {emptyText}
          </p>
        )}

        {bookings.map((b) => (
<div
  key={b.id}
  className="flex items-center justify-between rounded-lg border bg-background/60 p-3 hover:bg-background transition"
>

            <div>
              <p className="font-medium">
                {b.rentals?.rental_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(b.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <Badge variant="secondary">{b.status}</Badge>
              <p className="text-sm font-semibold">
                ${b.total_price}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ActivityCard