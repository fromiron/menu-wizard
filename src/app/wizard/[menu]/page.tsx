import { CreateCategory } from '~/app/_components/create-category';
import day from '~/lib/day';

import { api } from '~/trpc/server';
import { MasonryGrid } from './masonry';
import { ChangeColumnCount } from '~/app/_components/change-column-count';

export default async function Menu({
  params: { menu: id },
}: {
  params: { menu: string };
}) {
  const data = await api.menu.getByIdWithColumnCount({ id });

  return (
    <main className="">
      <div>{data.name}</div>
      <div>{data.description}</div>
      <div>{day.formatJapanTime(data.updatedAt)}</div>

      <CreateCategory menuId={data.id} />
      <ChangeColumnCount menuId={data.id} initCount={data.column?.count ?? 3} />
      <MasonryGrid
        categories={data.categories}
        columnCount={data?.column?.count ?? 3}
      />
    </main>
  );
}
