import React from 'react';
import { NavLink } from 'react-router';

const Navigation = ({
  authentication
}) => {
  return (
    <div className="flex items-center">
      <nav>
        <NavLink to="/">
          Dashboard
        </NavLink>
        <NavLink to="/scenarios">
          Scenarios
        </NavLink>
      </nav>
      <div>
        {`Logged in as ${authentication.firstName} ${authentication.lastName}`}
      </div>
    </div>
  );
};

export default Navigation;