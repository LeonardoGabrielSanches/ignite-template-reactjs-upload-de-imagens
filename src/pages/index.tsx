import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  ts: number;
  id: string;
  title: string;
  description: string;
  url: string;
};

type InfiniteQueryResponse = {
  data: Image[];
  after: number | null;
};

export default function Home(): JSX.Element {
  const getImages = async ({
    pageParam = null,
  }): Promise<InfiniteQueryResponse> => {
    const { data } = await api.get('/images', {
      params: {
        after: pageParam,
      },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<unknown, unknown, InfiniteQueryResponse>(
    'images',
    getImages,
    {
      getNextPageParam: (lastPage: { after: number }) => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    const imgsData = data?.pages.map(page => page.data).flat();
    return imgsData;
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt={8} onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
