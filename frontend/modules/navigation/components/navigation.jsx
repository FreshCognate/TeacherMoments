import classNames from 'classnames';
import { NavLink } from 'react-router';
import Button from '~/uikit/buttons/components/button';
import Dropdown from '~/uikit/dropdowns/components/dropdown';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';

const userMenuOptions = [
  { icon: 'logout', text: 'Logout', action: 'logout' }
];

const Navigation = ({
  authentication,
  isLoggingOut,
  isUserMenuOpen,
  onLoginClicked,
  onUserMenuToggle,
  onUserMenuOptionClicked
}) => {
  return (
    <div className="fixed top-0 w-full z-40 bg-lm-0 dark:bg-dm-1 border-b border-b-lm-3 dark:border-b-dm-2">
      <div className="max-w-7xl mx-auto">
        <div className={classNames("flex items-center w-full top-0 z-30 justify-between h-14 px-4  ",
          { "opacity-60": isLoggingOut }
        )}>
          <div>
            <nav className="flex gap-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  classNames("text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors", {
                    "underline": isActive
                  })
                }
              >
                Dashboard
              </NavLink>
              {authentication && (
                <>
                  <NavLink
                    to="/scenarios"
                    className={({ isActive }) =>
                      classNames("text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors", {
                        "underline": isActive
                      })
                    }
                  >
                    Scenarios
                  </NavLink>
                  <NavLink
                    to="/cohorts"
                    className={({ isActive }) =>
                      classNames("text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors", {
                        "underline": isActive
                      })
                    }
                  >
                    Cohorts
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div>
            {authentication && (
              <Dropdown
                placeholder={getUserDisplayName(authentication)}
                options={userMenuOptions}
                isOpen={isUserMenuOpen}
                onToggle={onUserMenuToggle}
                onOptionClicked={onUserMenuOptionClicked}
              />
            )}
            {(!authentication) && (
              <Button text="Login" onClick={onLoginClicked} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;