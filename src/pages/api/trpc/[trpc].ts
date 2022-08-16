import { Prisma } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from "../../../db/client";
import { colors } from '../../../utils/colors';

export const appRouter = trpc.router()
  .mutation('set-slug', {
    input: z
      .object({
        slug: z.string(),
        url: z.string()
      }),
    async resolve({ input }) {
      try {
        await prisma.shortLink.create({
          data: {
            url: input?.url,
            slug: input?.slug,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
          // The .code property can be accessed in a type-safe manner
          if (err.code === 'P2002') {
            console.log(colors.Bright + colors.FgRed, 'Please use a unique slug', colors.Reset);
          }
          console.log(colors.Bright + colors.FgRed, "PRISMA ERROR: ", colors.Reset, err)
        }
        throw err;
      }
      return {
        slug: input?.slug
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});