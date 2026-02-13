import {portal,checkout,polar} from "@polar-sh/better-auth"
import { betterAuth } from "better-auth";
import prisma from "@/lib/db"
import { polarClient } from "./polar";
import { prismaAdapter } from "better-auth/adapters/prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "c128b9a1-4bcb-474c-a5c5-246899803a99",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});