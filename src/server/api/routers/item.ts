import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const itemRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.item.findMany({
      include: {
        category: true,
      },
      where: {
        category: {
          userId: ctx.session.user?.id,
        },
      },
    });

    if (!items) {
      throw new TRPCError({ message: 'No items', code: 'NOT_FOUND' });
    }
    return items;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const item = await ctx.db.item.findUnique({
        where: { id: input.id },
        include: {
          category: true,
        },
      });

      if (!item || item.category.userId !== ctx.session.user?.id) {
        throw new TRPCError({ message: 'Item not found', code: 'NOT_FOUND' });
      }
      return item;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        categoryId: z.string(),
        description: z.string().nullable().optional(),
        price1: z.number(),
        price2: z.number().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.categoryId, userId: ctx.session.user?.id },
      });

      if (!category) {
        throw new TRPCError({
          message: 'Category not found',
          code: 'NOT_FOUND',
        });
      }

      return await ctx.db.item.create({
        data: {
          name: input.name,
          description: input.description,
          price1: input.price1,
          price2: input.price2,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        price1: z.number(),
        price2: z.number().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.db.item.findUnique({
        where: { id: input.id, category: { userId: ctx.session.user?.id } },
        include: {
          category: true,
        },
      });

      if (!item) {
        throw new TRPCError({ message: 'Item not found', code: 'NOT_FOUND' });
      }

      return await ctx.db.item.update({
        where: { id: input.id },
        data: {
          name: input.name,
          price1: input.price1,
          price2: input.price2,
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
      const item = await ctx.db.item.findUnique({
        where: { id: input.id, category: { userId: ctx.session.user?.id } },
        include: {
          category: true,
        },
      });

      if (!item) {
        throw new TRPCError({ message: 'Item not found', code: 'NOT_FOUND' });
      }

      return await ctx.db.item.delete({
        where: { id: input.id },
      });
    }),
});
