import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Client } from "@/lib/mocks";
import { formatPhoneNumber } from "@/lib/utils";

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{client.email}</p>
        <p className="text-gray-500">{formatPhoneNumber(client.phone)}</p>
        <p className="text-gray-500">{client.address}</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          View Client
        </Button>
      </CardFooter>
    </Card>
  );
}
