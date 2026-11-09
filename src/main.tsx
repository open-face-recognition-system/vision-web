import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Providers from './Providers';
import routes from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={createBrowserRouter(routes)} />
    </Providers>
  </StrictMode>,
);
