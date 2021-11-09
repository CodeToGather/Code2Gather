import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { GUEST, ROOT } from 'constants/routes';
import Guest from 'routes/guest';
import Landing from 'routes/landing';

const UnauthenticatedApp: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Landing />} path={ROOT} />
        <Route element={<Guest />} path={`${GUEST}/:id`} />
        <Navigate to={ROOT} />
      </Routes>
    </BrowserRouter>
  );
};

export default UnauthenticatedApp;
