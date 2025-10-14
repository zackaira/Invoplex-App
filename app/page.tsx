import { mockClients } from "@/lib/mocks";
import ClientCard from "./components/overview/ClientCard";

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 4000));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockClients.map((client) => (
          <ClientCard client={client} key={client.id} />
        ))}

        <p>Showing {mockClients.length} clients</p>
      </div>
    </div>
  );
}
