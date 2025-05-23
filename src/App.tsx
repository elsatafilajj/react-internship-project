import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from '@/context/AuthContext/AuthContextProvider';
import { router } from '@/routes/Routes';

import ThemeContextProvider from './context/ThemeContext/ThemeContextProvider';

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </ThemeContextProvider>
      <Toaster position="top-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
