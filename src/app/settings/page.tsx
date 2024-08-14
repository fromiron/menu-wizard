import Link from 'next/link';

import { auth } from '~/auth';
import { api } from '~/trpc/server';

export default async function Settings() {
  const session = await auth();

  return <main className="min-h-screen">Settings</main>;
}
