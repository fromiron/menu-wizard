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
        id: z.string(),
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

  getByIdWithColumnCount: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
          column: true,
        },
      });

      if (!menu) {
        throw new TRPCError({ message: 'Menu not found', code: 'NOT_FOUND' });
      }
      return menu;
    }),

  changeColumnCount: protectedProcedure
    .input(
      z.object({
        count: z
          .number()
          .min(1, '変更範囲は１から５までです。')
          .max(5, '変更範囲は１から５までです。'),
        menuId: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const menuColumnCount = await ctx.db.menuColumnCount.findUnique({
        where: { menuId: input.menuId },
      });

      if (!menuColumnCount) {
        throw new TRPCError({
          message: 'ColumnCount not found',
          code: 'NOT_FOUND',
        });
      }

      return await ctx.db.menuColumnCount.update({
        where: { menuId: input.menuId },
        data: {
          count: input.count,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('ctx.session.user', ctx.session.user);

      return await ctx.db.menu.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
        id: z.string(),
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
