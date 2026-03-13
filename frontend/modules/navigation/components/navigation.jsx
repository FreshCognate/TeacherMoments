import React, { useRef } from 'react';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router';
import map from 'lodash/map';
import filter from 'lodash/filter';
import Button from '~/uikit/buttons/components/button';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Dropdown from '~/uikit/dropdowns/components/dropdown';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

const userMenuOptions = [
  { icon: 'logout', text: 'Logout', action: 'logout' }
];

const navLinkClass = ({ isActive }) =>
  classNames("text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors", {
    "underline": isActive
  });

const mobileNavLinkClass = ({ isActive }) =>
  classNames("block px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:bg-lm-1 dark:hover:bg-dm-2 rounded-md transition-colors", {
    "underline": isActive
  });

const Navigation = ({
  authentication,
  isLoggingOut,
  isMobileMenuOpen,
  isUserMenuOpen,
  onLoginClicked,
  onMobileMenuToggle,
  onUserMenuToggle,
  onUserMenuOptionClicked
}) => {
  const mobileMenuRef = useRef();

  useOnClickOutside(mobileMenuRef, () => {
    if (isMobileMenuOpen) {
      onMobileMenuToggle();
    }
  });

  const isAdmin = authentication && (authentication.role === 'SUPER_ADMIN' || authentication.role === 'ADMIN');

  const navLinks = [
    { to: '/', text: 'Dashboard', end: true },
    { to: '/scenarios', text: 'Scenarios', requiresAuth: true },
    { to: '/cohorts', text: 'Cohorts', requiresAuth: true },
    { to: '/history', text: 'History', requiresAuth: true },
    { to: '/users', text: 'Users', requiresAuth: true, isAdminOnly: true }
  ];

  const visibleLinks = filter(navLinks, (link) => {
    if (link.requiresAuth && !authentication) return false;
    if (link.isAdminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <div className="fixed top-0 w-full z-40 bg-lm-0 dark:bg-dm-1 border-b border-b-lm-3 dark:border-b-dm-2">
      <div className="max-w-7xl mx-auto">
        <div
          className={classNames("flex items-center w-full top-0 z-30 justify-between h-14 px-4", {
            "opacity-60": isLoggingOut
          })}
        >
          <div>
            <nav className="flex items-center gap-x-4">
              <Link
                to="/"
                className="flex items-center mr-4"
              >
                <img
                  src={'/tm-logo.png'}
                  className="w-16"
                />
                <span className="ml-2 font-extralight leading-4 text-sm">
                  Teacher<br />Moments
                </span>
              </Link>
              {map(visibleLinks, (link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    classNames("hidden md:inline", navLinkClass({ isActive }))
                  }
                >
                  {link.text}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {authentication && (
              <div className="hidden md:block">
                <Dropdown
                  placeholder={getUserDisplayName(authentication)}
                  options={userMenuOptions}
                  isOpen={isUserMenuOpen}
                  onToggle={onUserMenuToggle}
                  onOptionClicked={onUserMenuOptionClicked}
                />
              </div>
            )}
            {(!authentication) && (
              <Button text="Login" onClick={onLoginClicked} />
            )}
            {authentication && (
              <FlatButton
                className="md:hidden"
                icon={isMobileMenuOpen ? 'cancel' : 'menu'}
                isCircular
                ariaLabel="Toggle menu"
                onClick={onMobileMenuToggle}
              />
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && authentication && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-t-lm-2 dark:border-t-dm-2 bg-lm-0 dark:bg-dm-1 shadow-lg"
        >
          <div className="px-2 py-2 space-y-1">
            {map(visibleLinks, (link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={mobileNavLinkClass}
                onClick={onMobileMenuToggle}
              >
                {link.text}
              </NavLink>
            ))}
            <div className="h-px my-1 bg-lm-2 dark:bg-dm-2" />
            <div className="px-3 py-2 text-xs text-black/40 dark:text-white/40">
              {getUserDisplayName(authentication)}
            </div>
            <button
              type="button"
              onClick={() => {
                onMobileMenuToggle();
                onUserMenuOptionClicked('logout');
              }}
              className="block w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:bg-lm-1 dark:hover:bg-dm-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
