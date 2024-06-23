import Link from 'next/link';
import { CreateCategory } from '~/app/_components/create-category';
import day from '~/lib/day';

import { api } from '~/trpc/server';
import { Category } from './category';

export default async function Menu({
  params: { menu: id },
}: {
  params: { menu: string };
}) {
  const data = await api.menu.getById({ id });

  return (
    <main className="">
      <div>{data.name}</div>
      <div>{data.description}</div>
      <div>{day.formatJapanTime(data.updatedAt)}</div>
      <CreateCategory menuId={data.id} />
      {data.categories.map((category) => (
        <Category key={`category_${category.id}`} data={category} />
      ))}
    </main>
  );
}
