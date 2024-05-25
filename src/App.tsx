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
import { cn } from '@/lib/utils';
import { shimmer } from '@/shimmer';
import { useEffect, useState } from 'react';

type Post = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  image: string;
};

const apiURL = import.meta.env.VITE_API as string;

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${apiURL}/posts?page=${pageNumber}`);

      if (!response.ok) throw new Error('X');

      const fetchedPosts = (await response.json()) as Post[];
      setPosts(fetchedPosts);
    })();
  }, [pageNumber]);

  return (
    <main className={cn('w-screen h-screen p-4 2')}>
      <header className='pt-6 pb-10'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={pageNumber <= 1}
                to={`?page=${pageNumber - 1}`}
                tabIndex={pageNumber <= 1 ? -1 : undefined}
                className={
                  pageNumber <= 1 ? 'pointer-events-none opacity-50' : undefined
                }
                onClick={() => setPageNumber(pageNumber - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink to='#' isActive>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPageNumber(pageNumber + 1)}
                aria-disabled={posts.length === 0}
                to={`?page=${pageNumber + 1}`}
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
          ...
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
                  <img
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
