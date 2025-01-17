import { api } from '~/trpc/server';
import { CreateMenu } from '../_components/create-menu';
import { MenuSlider } from '~/components/menu-slider';

export default async function Wizard() {
  const menus = await api.menu.getAll();

  if (!menus.length || menus.length === 0) {
    return (
      <>
        <div>登録されたメニューがございません。</div>
        <CreateMenu />
      </>
    );
  }

  return (
    <main className="block">
      <MenuSlider menus={menus} />
      <CreateMenu />
    </main>
  );
}
