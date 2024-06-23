import { type Category } from '@prisma/client';
import day from '~/lib/day';

export function Category({ data }: { data: Category }) {
  return (
    <div>
      <div>{data.name}</div>
      <div>{day.formatJapanTime(data.updatedAt)}</div>
    </div>
  );
}
