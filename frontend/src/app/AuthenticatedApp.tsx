import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { HOME, ROOM } from 'constants/routes';
import Home from 'routes/home';
import Room from 'routes/room';

const AuthenticatedApp: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path={HOME} />
        <Route element={<Room />} path={ROOM} />
        <Navigate to={HOME} />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
