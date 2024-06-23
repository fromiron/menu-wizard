import { Button } from '~/components/ui/button';
import { auth } from '~/auth';
import Link from 'next/link';

export const Header = async () => {
  const session = await auth();
  return (
    <div className="sticky top-0 flex h-16 w-screen items-center justify-between border-b border-gray-300 bg-stone-500 px-8 shadow-md drop-shadow-2xl">
      <div className="text-2xl font-bold">logo</div>
      <div className="flex gap-3">
        {session?.isLoggedIn
          ? signinUserMenu.map((menu) => (
              <Link key={menu.name} href={menu.href}>
                <Button variant="ghost">{menu.name}</Button>
              </Link>
            ))
          : nonSigninUserMenu.map((menu) => (
              <Link key={menu.name} href={menu.href}>
                <Button variant="ghost">{menu.name}</Button>
              </Link>
            ))}
        <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
          <Button variant="outline">{session ? 'Sign out' : 'Sign in'}</Button>
        </Link>
      </div>
    </div>
  );
};

type Menu = {
  name: string;
  href: string;
};
const signinUserMenu: Menu[] = [
  { name: 'Wizard', href: '/wizard' },
  { name: 'Settings', href: '/settings' },
];

const nonSigninUserMenu: Menu[] = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
];
