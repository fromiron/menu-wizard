'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

import { type Menu, type Category, type Item } from '@prisma/client';
import CategoryContainer from './category-container';
import {
  DEFAULT_MENU_COLUMN_COUNT,
  MAXIMUM_MENU_COLUMN_COUNT,
  MINIMUM_MENU_COLUMN_COUNT,
} from '~/constants/menu';
import { Button } from '~/components/ui/button';

enum PaperAspectRatio {
  a4 = 1.414,
  b5 = 1.294,
}

export type CategoryWithItems = Category & {
  items: Item[];
};

type MenuWithCategories = Menu & {
  categories: CategoryWithItems[];
};

type Props = {
  menu: MenuWithCategories;
};

const MenuContainer = ({ menu: initialData }: Props) => {
  const [menu, setMenu] = useState<MenuWithCategories>(initialData);
  const [columnCount, setColumnCount] = useState(
    initialData.column ?? DEFAULT_MENU_COLUMN_COUNT,
  );
  const [height, setHeight] = useState<string>('auto');
  const [aspectRatio, setAspectRatio] = useState<PaperAspectRatio>(
    PaperAspectRatio.a4,
  );
  const [overflowingCategories, setOverflowingCategories] = useState<string[]>(
    [],
  );
  const printAreaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const resizeListener = () => {
      const printAreaWidth = printAreaRef.current?.offsetWidth ?? 300;
      setHeight(printAreaWidth * aspectRatio + 'px');
    };
    resizeListener();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [aspectRatio]);

  const increaseColumn = () => {
    setColumnCount((prev) => Math.min(prev + 1, MAXIMUM_MENU_COLUMN_COUNT));
  };
  const decreaseColumn = () => {
    setColumnCount((prev) => Math.max(prev - 1, MINIMUM_MENU_COLUMN_COUNT));
  };
  const changeAspectRatio = (newAspectRatio: PaperAspectRatio) => {
    setAspectRatio(newAspectRatio);
  };
  useEffect(() => {
    if (
      menu?.categories.some(
        (cat) =>
          cat.column === undefined ||
          cat.order === undefined ||
          cat.order === 0,
      )
    ) {
      const updatedCategories = menu?.categories.map((cat, index) => ({
        ...cat,
        column: cat.column ?? index,
        order: cat.order !== undefined && cat.order !== 0 ? cat.order : index,
      }));

      setMenu({ ...menu, categories: updatedCategories });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newOverflowing = entries
          .filter((entry) => !entry.isIntersecting)
          .map((entry) => entry.target.getAttribute('data-category-id') || '');
        setOverflowingCategories(newOverflowing);
      },
      {
        root: printAreaRef.current,
        threshold: 1,
      },
    );

    const categoryElements = document.querySelectorAll('[data-category-id]');
    categoryElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [menu.categories]);

  const getColumns = (categories: CategoryWithItems[], columnCount: number) => {
    const columns: CategoryWithItems[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    categories
      .sort(
        (a, b) =>
          (a.column ?? 0) - (b.column ?? 0) || (a.order ?? 0) - (b.order ?? 0),
      )
      .forEach((category) => {
        const columnIndex = Math.min(
          Math.max(category.column ?? 0, 0),
          columnCount - 1,
        );
        if (columns[columnIndex]) {
          columns[columnIndex].push(category);
        } else {
          columns[columnIndex] = [category];
        }
      });
    return columns;
  };
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination || !menu) return;

    if (type === 'CATEGORY') {
      const allCategories = [...menu.categories];
      const sourceColumn = parseInt(source.droppableId.split('-')[1] ?? '0');
      const destColumn = parseInt(destination.droppableId.split('-')[1] ?? '0');

      const movedCategory = allCategories.find(
        (cat) => cat.column === sourceColumn && cat.order === source.index,
      );

      if (!movedCategory) return;

      const remainingCategories = allCategories.filter(
        (cat) => cat !== movedCategory,
      );

      movedCategory.column = destColumn;
      movedCategory.order = destination.index;

      remainingCategories.forEach((cat) => {
        if (cat.column === destColumn) {
          if (sourceColumn === destColumn) {
            if (
              cat.order >= Math.min(source.index, destination.index) &&
              cat.order <= Math.max(source.index, destination.index)
            ) {
              cat.order += source.index > destination.index ? 1 : -1;
            }
          } else {
            if (cat.order >= destination.index) {
              cat.order += 1;
            }
          }
        } else if (cat.column === sourceColumn && sourceColumn !== destColumn) {
          if (cat.order > source.index) {
            cat.order -= 1;
          }
        }
      });

      const updatedCategories = [...remainingCategories, movedCategory].sort(
        (a, b) => a.column - b.column || a.order - b.order,
      );

      setMenu({ ...menu, categories: updatedCategories });

      // TODO apiつなぐ
    } else if (type === 'ITEM') {
      const sourceCategory = menu.categories.find(
        (cat) => cat.id === source.droppableId,
      );
      const destCategory = menu.categories.find(
        (cat) => cat.id === destination.droppableId,
      );

      if (sourceCategory && destCategory) {
        const sourceItems = Array.from(sourceCategory.items);
        const destItems =
          source.droppableId === destination.droppableId
            ? sourceItems
            : Array.from(destCategory.items);

        const [movedItem] = sourceItems.splice(source.index, 1);
        if (movedItem) {
          destItems.splice(destination.index, 0, movedItem);
        }

        const newCategories = menu.categories.map((cat) => {
          if (cat.id === sourceCategory.id) {
            return { ...cat, items: sourceItems };
          }
          if (cat.id === destCategory.id) {
            return { ...cat, items: destItems };
          }
          return cat;
        });

        setMenu({ ...menu, categories: newCategories });
        // TODO apiつなぐ
      }
    }
  };
  const columns = getColumns(menu.categories, columnCount);

  return (
    <>
      <div className="ml-4 flex w-fit gap-x-4 rounded bg-primary-foreground p-4 shadow-lg">
        <Button size="icon" onClick={decreaseColumn}>
          -
        </Button>
        <Button size="icon" onClick={increaseColumn}>
          +
        </Button>
        <Button
          size="icon"
          onClick={() => changeAspectRatio(PaperAspectRatio.a4)}
        >
          A4
        </Button>
        <Button
          size="icon"
          onClick={() => changeAspectRatio(PaperAspectRatio.b5)}
        >
          B5
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          ref={printAreaRef}
          style={{ height }}
          className="m-4 rounded bg-primary-foreground p-8 shadow-lg"
        >
          <div className="w-full rounded p-4 text-center">
            <h1 className="mb-4 text-4xl font-bold">{menu.name}</h1>
            <p className="mx-auto max-w-[60%] text-lg text-muted-foreground">
              {menu.description} Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Ad architecto amet et suscipit obcaecati
              delectus ipsam eaque laborum corrupti repellat, deleniti, mollitia
            </p>
          </div>
          <div className="mt-2 flex gap-x-2">
            {columns.map((column, columnIndex) => (
              <Droppable
                key={columnIndex}
                droppableId={`column-${columnIndex}`}
                type="CATEGORY"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="box-border min-h-48 w-full"
                  >
                    {column.map((category, index) => (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-1"
                            data-category-id={category.id}
                          >
                            <div className="w-full rounded p-4 transition-all active:bg-black/20">
                              <CategoryContainer category={category} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default MenuContainer;
