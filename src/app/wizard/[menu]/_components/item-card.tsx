import { type Item } from '@prisma/client';
import { useState } from 'react';
import { Separator } from '~/components/ui/separator';
import ItemSettingPopover from './menu-popover';

type Props = {
  item: Item;
  reverseColor: boolean;
};
const ItemCard = ({ item, reverseColor }: Props) => {
  const [reverseLayout, setReverseLayout] = useState(!!item.reverse);

  const handleReverseLayout = () => {
    setReverseLayout((prev) => !prev);
  };

  return (
    <div className="group/item relative">
      <div
        className={`flex items-start gap-4 transition-all ${reverseLayout ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <div
          //  TODO image 追加フィルド
          className="h-24 w-24 rounded-md bg-primary/10 object-cover"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
          <ItemSettingPopover
            className="invisible group-hover/item:visible"
            handleReverseLayout={handleReverseLayout}
            item={item}
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-nowrap text-lg font-medium">{item.name}</h3>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
          <Separator />
          <p className="font-medium">\{item.price1}</p>
          {item.price2 && <p className="text-sm">\{item.price2}</p>}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
