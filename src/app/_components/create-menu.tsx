'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '~/trpc/react';

export function CreateMenu() {
  const router = useRouter();
  const [name, setName] = useState('');

  const createMenu = api.menu.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName('');
    },
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMenu.mutate({ name });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={onChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createMenu.isPending}
      >
        {createMenu.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
