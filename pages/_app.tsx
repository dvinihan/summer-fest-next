import '../src/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';
import theme from '../src/styles/theme';
import { ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppContextProvider } from '../src/context/AppContext';

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider theme={theme}>
            <AppContextProvider>
              <Component {...pageProps} />
              <ReactQueryDevtools />
            </AppContextProvider>
          </ThemeProvider>
        </Hydrate>
      </QueryClientProvider>
    </UserProvider>
  );
}
