'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import {
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion';

enum PaperAspectRatio {
  a = 1.414,
  b = 1.294,
}

const categorieData = [
  [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    { id: 4, name: 'Category 4' },
  ],
  [
    { id: 5, name: 'Category 5' },
    { id: 6, name: 'Category 6' },
    { id: 7, name: 'Category 7' },
    { id: 8, name: 'Category 8' },
  ],
  [
    { id: 9, name: 'Category 9' },
    { id: 10, name: 'Category 10' },
    { id: 11, name: 'Category 11' },
    { id: 12, name: 'Category 12' },
  ],
];

export default function Print() {
  const printAreaRef = useRef<HTMLDivElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<PaperAspectRatio>(
    PaperAspectRatio.a,
  );
  const [height, setHeight] = useState<number | string>(500);
  const [columns, setColumns] = useState<number[]>([0, 1, 2]);
  const [items, setItems] = useState(categorieData);
  const controls = useDragControls();

  useEffect(() => {
    const resizeListener = () => {
      const printAreaWidth = printAreaRef.current?.offsetWidth ?? 300;
      setHeight(printAreaWidth * aspectRatio);
    };
    resizeListener();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [aspectRatio]);

  const handleReorderItems = (columnIndex: number, newItems: any[]) => {
    const updatedItems = [...items];
    updatedItems[columnIndex] = newItems;
    setItems(updatedItems);
  };

  return (
    <div className="w-full bg-green-400 p-12">
      <div>
        <Button onClick={() => setAspectRatio(PaperAspectRatio.a)}>A</Button>
        <Button onClick={() => setAspectRatio(PaperAspectRatio.b)}>B</Button>
        <Button onClick={() => setColumns([0])}>1</Button>
        <Button onClick={() => setColumns([0, 1])}>2</Button>
        <Button onClick={() => setColumns([0, 1, 2])}>3</Button>
      </div>
      <div
        id="print-area"
        ref={printAreaRef}
        style={{
          height,
        }}
        className="flex w-full gap-4 bg-stone-500 p-4 text-stone-950"
      >
        <Reorder.Group
          axis="x"
          onReorder={setColumns}
          values={columns}
          className="flex w-full gap-4"
        >
          {columns.map((column) => (
            <Reorder.Item
              key={column}
              value={column}
              className="w-full"
              dragListener={false}
              dragControls={controls}
            >
              <div
                className="reorder-handle h-10 w-10 bg-red-500"
                onPointerDown={(e) => controls.start(e)}
              />
              <motion.div className="h-full flex-grow bg-white p-4">
                <Reorder.Group
                  axis="y"
                  onReorder={(newItems) => handleReorderItems(column, newItems)}
                  values={items[column]}
                  className="flex flex-col gap-4"
                >
                  {items[column].map((item) => (
                    <Category key={item.id} value={item} />
                  ))}
                </Reorder.Group>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

const Category = ({ value }) => {
  const controls = useDragControls();
  const containerRef = useRef(null);

  const handleDrag = (event, info) => {
    if (containerRef.current) {
      const container = containerRef.current;
      if (container.getBoundingClientRect()) {
        const containerX = container.getBoundingClientRect().left;
        const xDifference = info.point.x - containerX;

        const diff = info.point.x - container.getBoundingClientRect().x;
        console.log(diff, containerRef.current.clientWidth);

        // const parentRect = parentElement.getBoundingClientRect();
        // const xDifference = info.point.x - parentRect.left;
        // console.log('Difference in x:', xDifference);
      }
    }
  };

  return (
    <Reorder.Item
      value={value}
      ref={containerRef}
      dragListener={false}
      dragControls={controls}
      className="relative w-full overflow-visible"
    >
      <motion.div
        drag="x"
        className="min-h-12 bg-green-300"
        onDrag={handleDrag}
      >
        {value.name}
        <div
          className="reorder-handle absolute right-0 top-0 h-10 w-10 cursor-pointer bg-red-300 transition-colors hover:bg-red-500"
          onPointerDown={(e) => controls.start(e)}
        />
      </motion.div>
    </Reorder.Item>
  );
};
