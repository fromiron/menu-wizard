import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      include: {
        items: true,
      },
      where: {
        userId: ctx.session.user?.id,
      },
    });

    if (!categories) {
      throw new TRPCError({ message: 'No categories', code: 'NOT_FOUND' });
    }
    return categories;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id, userId: ctx.session.user?.id },
        include: {
          items: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          message: 'Category not found',
          code: 'NOT_FOUND',
        });
      }
      return category;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        menuId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const menu = await ctx.db.menu.findUnique({
        where: { id: input.menuId, userId: ctx.session.user?.id },
      });

      if (!menu) {
        throw new TRPCError({ message: 'Menu not found', code: 'NOT_FOUND' });
      }

      return await ctx.db.category.create({
        data: {
          name: input.name,
          menuId: input.menuId,
          userId: ctx.session.user?.id,
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
      const category = await ctx.db.category.findUnique({
        where: { id: input.id, userId: ctx.session.user?.id },
      });

      if (!category) {
        throw new TRPCError({
          message: 'Category not found',
          code: 'NOT_FOUND',
        });
      }

      return await ctx.db.category.update({
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
      const category = await ctx.db.category.findUnique({
        where: { id: input.id, userId: ctx.session.user?.id },
      });

      if (!category) {
        throw new TRPCError({
          message: 'Category not found',
          code: 'NOT_FOUND',
        });
      }

      return await ctx.db.category.delete({
        where: { id: input.id, userId: ctx.session.user?.id },
      });
    }),
});
