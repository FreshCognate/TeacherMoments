import React from 'react';
import { Link, NavLink } from 'react-router';

const Navigation = ({
  authentication
}) => {
  return (
    <div className="flex items-center fixed w-full top-0 z-30 justify-between h-14 px-4  bg-lm-0 dark:bg-dm-0 border-b border-b-lm-3 dark:border-b-dm-2">
      <div>
        <nav>
          <NavLink to="/" className="mr-4 text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors">
            Dashboard
          </NavLink>
          <NavLink to="/scenarios" className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors">
            Scenarios
          </NavLink>
        </nav>
      </div>
      <div>
        {authentication && (
          <div className="text-black/60 dark:text-white/60">
            {`Logged in as ${authentication.firstName} ${authentication.lastName}`}
          </div>
        )}
        {(!authentication) && (
          <Link to="/login" className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navigation;