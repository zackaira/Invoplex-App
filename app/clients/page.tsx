import { getClientsWithOutstanding } from "@/lib/actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function Clients() {
  // TODO: Replace with actual user ID from authentication
  const userId = "cmgexy4630002r7qfecfve8hq";

  const clients = await getClientsWithOutstanding(userId);

  // The data is already in the correct format from the server action
  const transformedClients = clients || [];

  return (
    <div className="group document-list clients">
      <DataTable
        columns={columns}
        data={transformedClients}
        filterColumn="name"
        filterPlaceholder="Filter by client name..."
      />
    </div>
  );
}
