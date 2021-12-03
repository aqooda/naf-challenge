import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import { routes } from './routes';

const App: React.FC = () => (
  <Router>
    <Routes>
      {Object.entries(routes).map(([routeName, routeProps]) => (
        <Route key={routeName} {...routeProps} />
      ))}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
