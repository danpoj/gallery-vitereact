import { PostImage } from '@/components/post-image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { db } from '@/db/drizzle';
import { postTable } from '@/db/schema';
import { cn } from '@/lib/utils';
import { shimmer } from '@/shimmer';
import { faker } from '@faker-js/faker';
import { desc } from 'drizzle-orm';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const limit = 15;

export default function App({
  searchParams: { page },
}: {
  searchParams: { page?: string | string[] };
}) {
  if (Array.isArray(page)) redirect('/');

  const pageNumber =
    page && !isNaN(parseInt(page)) && parseInt(page) > 0 ? parseInt(page) : 1;

  const posts = await db
    .select()
    .from(postTable)
    .orderBy(desc(postTable.createdAt))
    .limit(limit)
    .offset((pageNumber - 1) * limit);

  return (
    <main className={cn('w-screen h-screen p-4 2')}>
      <header className='pt-6 pb-10'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={pageNumber <= 1}
                href={`?page=${pageNumber - 1}`}
                tabIndex={pageNumber <= 1 ? -1 : undefined}
                className={
                  pageNumber <= 1 ? 'pointer-events-none opacity-50' : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                aria-disabled={posts.length === 0}
                href={`?page=${pageNumber + 1}`}
                tabIndex={posts.length === 0 ? -1 : undefined}
                className={
                  posts.length === 0
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </header>

      {posts.length === 0 && (
        <p className='text-3xl flex items-center justify-center w-full font-thin'>
          no posts.
        </p>
      )}

      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2'>
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <div
                  className={cn(
                    'w-9 h-9 rounded-full overflow-hidden relative shrink-0 bg-slate-100',
                    shimmer
                  )}
                >
                  <Image
                    unoptimized
                    src={post.avatar}
                    width={60}
                    height={60}
                    alt='avatar'
                    className='inset-0 absolute object-cover'
                  />
                </div>
                <p className='truncate text-lg'>{post.username}</p>
              </CardTitle>
              <CardDescription className='flex-col flex'>
                <>
                  <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                  <span>{post.email}</span>
                </>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostImage key={post.image} image={post.image} />
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    image: faker.image.url(),
  };
}
