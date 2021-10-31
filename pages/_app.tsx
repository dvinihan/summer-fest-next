import '../src/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import Head from 'next/head';
import theme from '../src/styles/theme';
import { ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <UserProvider
      // domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}
      // clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      // redirectUri={process.env.NEXT_PUBLIC_AUTH0_BASE_URL}
      >
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </UserProvider>
    </>
  );
}
