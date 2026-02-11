"use client"
import { Button } from "@/components/ui/button";
import LogoutButton from "@/features/auth/components/logout-button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(
    trpc.createWorkflows.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
      },
    }),
  );
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-screen h-screen">
      Server page component
      <div> {JSON.stringify(data)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Add Workflows
      </Button>
      <LogoutButton />
    </div>
  );
};

export default page;
