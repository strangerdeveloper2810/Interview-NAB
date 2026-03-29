import { type FC, type JSX } from 'react';
import { Outlet } from 'react-router';
const HomeLayout: FC = (): JSX.Element => {
  return (
    <div>
      abc
      <Outlet />
    </div>
  );
};

export default HomeLayout;
