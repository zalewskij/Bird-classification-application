import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css'

import App from './components/App.tsx'
import ErrorPage from './components/ErrorPage.tsx';
import MainPage from './components/MainPage.tsx'
import About from './components/About.tsx';
import ChoosingFragment from './components/ChoosingFragment.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: 'choosing_fragment',
        element: <ChoosingFragment />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
