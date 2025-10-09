import { mockClients } from "@/lib/mocks";
import ClientCardSkeleton from "./components/ClientCardSkeleton";

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <p>Showing {mockClients.length} clients</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ClientCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
