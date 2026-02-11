import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  testAi: baseProcedure.mutation(async () => {
    
    await inngest.send({
      name: "execute/ai",
    });
    return { success: true, message: "job Queued.." };
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflows: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "rishabh@example.com",
      },
    });
    return { success: true, message: "Job Queued.." };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
