'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '~/components/ui/use-toast';
import { parseError } from '~/lib/parse-error';
import { api } from '~/trpc/react';
import { type Item } from '@prisma/client';

type ItemState = Omit<Item, 'createdAt' | 'updatedAt'>;

type ItemStateUpdate = {
  [K in keyof ItemState]: {
    field: K;
    value: ItemState[K];
  };
}[keyof ItemState];

export function useItem() {
  const { toast } = useToast();
  const router = useRouter();
  const [state, setState] = useState<ItemState>({
    id: 0,
    name: '',
    price1: 0,
    price2: null,
    description: null,
    categoryId: '',
    reverse: false,
  });

  const resetState = () => {
    setState({
      id: 0,
      name: '',
      price1: 0,
      price2: null,
      description: null,
      categoryId: '',
      reverse: false,
    });
  };

  const updateState = ({ field, value }: ItemStateUpdate) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const createItem = api.item.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetState();
      toast({
        title: 'アイテムが作成されました',
        description: 'アイテムが正常に作成されました。',
      });
    },
    onError: (err) => {
      const parsedErr = parseError(err);
      toast({
        variant: 'destructive',
        title: 'アイテム作成に失敗しました',
        description: parsedErr,
      });
    },
  });

  const updateItem = api.item.update.useMutation({
    onSuccess: () => {
      router.refresh();
      resetState();
      toast({
        title: 'アイテムが更新されました',
        description: 'アイテムが正常に更新されました。',
      });
    },
    onError: (err) => {
      const parsedErr = parseError(err);
      toast({
        variant: 'destructive',
        title: 'アイテム修正に失敗しました',
        description: parsedErr,
      });
    },
  });

  const deleteItem = api.item.delete.useMutation({
    onSuccess: () => {
      resetState();
      toast({
        title: 'アイテムが削除されました',
        description: 'アイテムが正常に削除されました。',
      });
      router.refresh();
    },
    onError: (err) => {
      const parsedErr = parseError(err);
      toast({
        variant: 'destructive',
        title: 'アイテム削除に失敗しました',
        description: parsedErr,
      });
    },
  });

  const getItem = api.item.getById.useQuery(
    { id: state.id },
    { enabled: !!state.id },
  );

  const handleSubmit = (data: ItemState) => {
    if (data.id) {
      updateItem.mutate(data);
    } else {
      const { ...createData } = data;
      createItem.mutate(createData);
    }
  };

  const handleDelete = () => {
    if (state.id) {
      deleteItem.mutate({ id: state.id });
    }
  };

  return {
    state,
    updateState,
    resetState,
    handleSubmit,
    handleDelete,
    isLoading:
      createItem.isPending || updateItem.isPending || deleteItem.isPending,
    isError: createItem.isError || updateItem.isError || deleteItem.isError,
    error: createItem.error ?? updateItem.error ?? deleteItem.error,
    item: getItem.data,
  };
}
