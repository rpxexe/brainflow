import { requireAuth } from "@/lib/auth-utils";

interface pageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const Page = async ({ params }: pageProps) => {
  await requireAuth()
  const { workflowId } = await params;
  return <p>workflow id: {workflowId} </p>;
};
export default Page;
