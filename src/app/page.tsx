import LogoutButton from "@/features/auth/components/logout-button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const page = async () => {
  await requireAuth();
  const data = await caller.getUsers();

  return (
    <div>
      Server page component
      {JSON.stringify(data)}
      <LogoutButton/>
    </div>
  );
};

export default page;
