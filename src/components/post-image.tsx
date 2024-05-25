'use client';

import { cn } from '@/lib/utils';

type Props = { image: string };

export const PostImage = ({ image }: Props) => {
  return (
    <div
      className={cn('aspect-square rounded-xl overflow-hidden bg-slate-100')}
    >
      <img src={image} alt='image' className='w-full h-full object-cover' />
    </div>
  );
};
