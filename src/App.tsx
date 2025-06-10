import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from '@/context/AuthContext/AuthContextProvider';
import TourRefsContextProvider from '@/context/TourRefsContext/TourRefsContextProvider';
import { router } from '@/routes/Routes';

import ThemeContextProvider from './context/ThemeContext/ThemeContextProvider';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <TourRefsContextProvider>
            <RouterProvider router={router} />
          </TourRefsContextProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
      <Toaster position="bottom-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
