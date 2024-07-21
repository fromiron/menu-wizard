import { Droppable, Draggable } from '@hello-pangea/dnd';
import ItemCard from './item-card';
import { type CategoryWithItems } from './menu-container';
import { cn } from '~/lib/utils';
import { useState } from 'react';

import { Switch } from '~/components/ui/switch';

type Props = {
  category: CategoryWithItems;
};

const CategoryContainer = ({ category }: Props) => {
  const [reverseColor, setReverseColor] = useState(!!category.reverse);

  const onCheckedChange = () => {
    setReverseColor((prev) => !prev);
  };
  return (
    <div
      className={cn(
        'rounded',
        reverseColor
          ? 'bg-primary text-primary-foreground'
          : 'bg-primary-foreground text-primary',
      )}
    >
      <div className="group/category flex justify-between">
        <div className="mx-2 transition-colors">
          <h2 className="py-2 text-xl font-semibold">{category.name}</h2>
        </div>
        <Switch
          className="invisible m-2 group-hover/category:visible"
          checked={reverseColor}
          onCheckedChange={onCheckedChange}
        />
        {/* <Button
          variant={reverseColor ? 'outline' : 'default'}
          size="iconRound"
          className="invisible absolute -right-4 -top-4 group-hover/category:visible"
          onClick={() => setReverseColor(!reverseColor)}
        >
          {reverseColor ? <IoColorFillOutline /> : <IoColorFill />}
        </Button> */}
      </div>
      <Droppable droppableId={category.id} type="ITEM">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {category?.items?.map((item, index) => (
              <Draggable
                key={`item-${item.id}`}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                    className="min-h-24 p-4"
                  >
                    <ItemCard item={item} reverseColor={reverseColor} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default CategoryContainer;
