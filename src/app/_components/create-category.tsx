'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '~/components/ui/use-toast';
import { parseError } from '~/lib/parse-error';

import { api } from '~/trpc/react';

export function CreateCategory({ menuId }: { menuId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');

  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName('');
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
    createCategory.mutate({ name, menuId });
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Category"
        value={name}
        onChange={onChangeName}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createCategory.isPending}
      >
        {createCategory.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
