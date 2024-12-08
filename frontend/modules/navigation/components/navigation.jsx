import React from 'react';
import { Link, NavLink } from 'react-router';

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
      {authentication && (
        <div>
          {`Logged in as ${authentication.firstName} ${authentication.lastName}`}
        </div>
      )}
      {(!authentication) && (
        <Link to="/login">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navigation;