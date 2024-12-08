import React from 'react';
import { Link, NavLink } from 'react-router';

const Navigation = ({
  authentication
}) => {
  return (
    <div className="flex items-center justify-between h-10 px-4 border-b border-b-lm-2 dark:border-b-dm-2">
      <div>

        <nav>
          <NavLink to="/" className="mr-4">
            Dashboard
          </NavLink>
          <NavLink to="/scenarios">
            Scenarios
          </NavLink>
        </nav>
      </div>
      <div>
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
    </div>
  );
};

export default Navigation;