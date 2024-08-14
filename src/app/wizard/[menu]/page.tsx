import { api } from '~/trpc/server';

export default async function Menu({
  params: { menu: id },
}: {
  params: { menu: string };
}) {
  const menu = await api.menu.getById({ id }).catch((err) => {
    console.error(err);
    return { id: '', name: '', description: '', categories: [] };
  });

  return <main>{/* TODO menuにカテゴリが無いときの表示 */}</main>;
}
