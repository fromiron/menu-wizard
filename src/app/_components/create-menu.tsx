'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '~/components/ui/use-toast';
import { parseError } from '~/lib/parse-error';

import { api } from '~/trpc/react';

export function CreateMenu() {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createMenu = api.menu.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName('');
      setDescription('');
    },
    onError: (err) => {
      const parsedErr = parseError(err);

      toast({
        variant: 'destructive',
        title: 'メニュー作成に失敗しました',
        description: parsedErr,
      });
    },
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMenu.mutate({ name, description });
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={onChangeName}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={onChangeDescription}
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
