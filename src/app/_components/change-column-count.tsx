'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '~/components/ui/use-toast';
import { parseError } from '~/lib/parse-error';

import { api } from '~/trpc/react';

export function ChangeColumnCount({
  menuId,
  initCount,
}: {
  menuId: string;
  initCount: number;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const changeCount = api.menu.changeColumnCount.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      const parsedErr = parseError(err);

      toast({
        variant: 'destructive',
        title: 'カラム数変更に失敗しました',
        description: parsedErr,
      });
    },
  });

  const increase = () => {
    changeCount.mutate({ count: initCount + 1, menuId });
  };

  const decrease = () => {
    changeCount.mutate({ count: initCount - 1, menuId });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Change Column Count</h2>
      <div>{initCount}</div>
      <button className="m-4 p-4" onClick={increase}>
        +
      </button>
      <button className="m-4 p-4" onClick={decrease}>
        -
      </button>
    </div>
  );
}
