import { Button } from "@/components/ui/button";
import { getClientsByUserId } from "@/lib/actions";
import Modal from "@/app/components/Modal";

export default async function Clients() {
  const clients = await getClientsByUserId("cmgexy4630002r7qfecfve8hq");

  console.log(clients);

  return (
    <div className="p-6">
      CLIENTS
      <Modal
        title="Add Client"
        description="Add a new client to your business"
        trigger={<Button>Add Client</Button>}
        cancelBtnText="Cancel"
      />
    </div>
  );
}
