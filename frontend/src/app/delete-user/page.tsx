import { deleteUser } from "@/entities";

export const dynamic = "force-dynamic";

export default async function Page() {
  await deleteUser();

  return null;
}
