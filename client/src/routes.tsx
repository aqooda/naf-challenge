import { RouteProps } from 'react-router-dom';
import CreateRequestPage from './pages/CreateRequestPage';
import ViewRequestPage from './pages/ViewRequestPage';

export type RouteName = 'CREATE_REQUEST' | 'VIEW_REQUEST';

export const routes: Record<RouteName, Required<Pick<RouteProps, 'element' | 'path'>>> = {
  CREATE_REQUEST: {
    path: '/requests',
    element: <CreateRequestPage />,
  },
  VIEW_REQUEST: {
    path: '/requests/:id',
    element: <ViewRequestPage />,
  },
};
