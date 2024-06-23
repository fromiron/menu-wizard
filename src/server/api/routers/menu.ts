import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const menuRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const menus = await ctx.db.menu.findMany({
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
      where: {
        userId: ctx.session.user?.id,
      },
    });

    if (!menus) {
      throw new TRPCError({ message: 'No menus', code: 'NOT_FOUND' });
    }
    return menus;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const menu = await ctx.db.menu.findUnique({
        where: { id: input.id, userId: ctx.session.user?.id },
        include: {
          categories: {
            include: {
              items: true,
            },
          },
        },
      });

      if (!menu) {
        throw new TRPCError({ message: 'Menu not found', code: 'NOT_FOUND' });
      }
      return menu;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('ctx.session.user', ctx.session.user);

      return await ctx.db.menu.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const menu = await ctx.db.menu.findUnique({
        where: { id: input.id },
      });

      if (!menu) {
        throw new TRPCError({ message: 'Menu not found', code: 'NOT_FOUND' });
      }

      return await ctx.db.menu.update({
        where: { id: input.id, userId: ctx.session.user?.id },
        data: {
          name: input.name,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const menu = await ctx.db.menu.findUnique({
        where: { id: input.id, userId: ctx.session.user?.id },
      });
      if (!menu) {
        throw new TRPCError({ message: 'Menu not found', code: 'NOT_FOUND' });
      }

      return await ctx.db.menu.delete({
        where: { id: input.id, userId: ctx.session.user?.id },
      });
    }),
});
