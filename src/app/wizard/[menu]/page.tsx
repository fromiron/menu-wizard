import { api } from '~/trpc/server';
import MenuContainer from './_components/menu-container';

export default async function Menu({
  params: { menu: id },
}: {
  params: { menu: string };
}) {
  const menu = await api.menu.getById({ id }).catch((err) => {
    console.error(err);
    return { id: '', name: '', description: '', categories: [] };
  });

  return (
    <main>
      {menu && <MenuContainer menu={menu} />}
      {/* TODO menuにカテゴリが無いときの表示 */}
    </main>
  );
}
