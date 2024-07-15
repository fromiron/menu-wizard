import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { MdEdit } from 'react-icons/md';
import { useForm, useWatch } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { type Item } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '~/lib/utils';
import { Switch } from '~/components/ui/switch';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: '２文字以上で入力してください',
  }),
  description: z.string().optional(),
  price1: z.coerce.number({
    required_error: '値段を入力してください',
    invalid_type_error: '数字のみ入力できます',
  }),
  price2: z.coerce
    .number({
      invalid_type_error: '数字のみ入力できます',
    })
    .optional(),
  reverse: z.boolean().optional().default(false),
});

type Props = {
  className?: string;
  handleReverseLayout: () => void;
  item: Item;
};
const ItemSettingPopover = ({
  className,
  handleReverseLayout,
  item,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      description: item.description ?? undefined,
      price1: item.price1,
      price2: item.price2 ?? undefined,
      reverse: item.reverse,
    },
  });
  const [reverseLayout, setReverseLayout] = useState(!!item.reverse);
  const price1 = useWatch({ control: form.control, name: 'price1' });
  const price2 = useWatch({ control: form.control, name: 'price2' });
  const price3 = Number(price1) + (Number(price2) || 0);
  const onCheckedChange = () => {
    setReverseLayout((prev) => !prev);
    form.setValue('reverse', !reverseLayout);
  };

  const calculateTax = (percentage: number) => {
    if (!isNaN(price1)) {
      const taxAmount = price1 * (percentage / 100);
      form.setValue('price2', parseFloat(taxAmount.toFixed(0)));
    }
  };

  const onSubmit = () => {};
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="iconRound" className={className} variant={'default'}>
          <MdEdit />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormControl>
              <Switch
                checked={reverseLayout}
                onCheckedChange={onCheckedChange}
              />
            </FormControl>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>価格</FormLabel>
                  <FormControl>
                    <Input placeholder="price1" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    税込み価格を入力してください。price2を入力するとprice1は税抜き価格として表示されます。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    税金
                    <Button
                      className="float-end"
                      size="iconRound"
                      onClick={() => calculateTax(8)}
                    >
                      8%
                    </Button>
                    <Button
                      size="iconRound"
                      className="float-end mr-2"
                      onClick={() => calculateTax(10)}
                    >
                      10%
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="price2" type="number" {...field} />
                  </FormControl>
                  <FormDescription>税金を入力してください。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>総価格: {price3}</div>
            <Button type="submit">保存</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default ItemSettingPopover;
