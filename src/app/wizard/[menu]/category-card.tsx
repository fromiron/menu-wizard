import { type Category } from '@prisma/client';

export function CategoryCard({ data }: { data: Category }) {
  return (
    <div className="break-words p-4">
      <div className="bg-slate-300">{data.name}</div>
      <div>{data.description}</div>
      <div>{data.id}</div>
    </div>
  );
}
