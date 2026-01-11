import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../../server/routers"; // Esta importação será corrigida abaixo

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});
