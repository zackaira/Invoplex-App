import { getClientsByUserId } from "@/lib/actions";

export default async function Clients() {
  const clients = await getClientsByUserId("cmgexy4630002r7qfecfve8hq");

  console.log(clients);

  return <div>CLIENTS</div>;
}
