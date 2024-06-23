'use client';
import type { Category } from '@prisma/client';
import Masonry from 'react-responsive-masonry';
import { CategoryCard } from './category-card';

import ReactToPrint from 'react-to-print';
import { useRef } from 'react';

export function MasonryGrid(data: {
  categories: Category[];
  columnCount: number;
}) {
  const printRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <ReactToPrint
        trigger={() => <button>Print!!</button>}
        content={() => printRef.current}
      />

      <div ref={printRef} className="printable">
        <Masonry columnsCount={data.columnCount}>
          {data.categories.map((category) => (
            <CategoryCard key={`category_${category.id}`} data={category} />
          ))}
        </Masonry>
      </div>
    </>
  );
}
