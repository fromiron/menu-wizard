import Link from 'next/link';

import { auth } from '~/auth';
import { api } from '~/trpc/server';
import { CreateMenu } from '../_components/create-menu';

export default async function Wizard() {
  const session = await auth();

  return (
    <main className="min-h-screen">
      <CreateMenu />
    </main>
  );
}
