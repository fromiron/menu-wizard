import Link from 'next/link';

import { CreatePost } from '~/app/_components/create-post';
import { auth } from '~/auth';
import { api } from '~/trpc/server';

export default async function Home() {
  return <main className="min-h-screen">Home</main>;
}
