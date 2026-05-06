import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

vi.mock('~/uikit/dropdowns/components/dropdown', () => ({
  default: ({ placeholder, children, isOpen }) => (
    <div data-testid="user-dropdown" data-open={isOpen}>
      <span data-testid="dropdown-placeholder">{placeholder}</span>
      {children}
    </div>
  )
}));

vi.mock('~/uikit/buttons/components/button', () => ({
  default: ({ text, onClick }) => <button onClick={onClick}>{text}</button>
}));

vi.mock('~/uikit/buttons/components/flatButton', () => ({
  default: ({ ariaLabel, onClick, icon, className }) => (
    <button aria-label={ariaLabel} onClick={onClick} className={className} data-icon={icon} />
  )
}));

vi.mock('~/modules/users/helpers/getUserDisplayName', () => ({
  default: (user) => user?.firstName || 'User'
}));

vi.mock('~/modules/users/helpers/getUserEmail', () => ({
  default: (user) => user?.email || ''
}));

vi.mock('~/core/app/hooks/useOnClickOutside', () => ({
  default: () => {}
}));

import Navigation from '../components/navigation';

const baseProps = {
  authentication: null,
  isLoggingOut: false,
  isMobileMenuOpen: false,
  isUserMenuOpen: false,
  onLoginClicked: vi.fn(),
  onMobileMenuToggle: vi.fn(),
  onUserMenuToggle: vi.fn(),
  onUserMenuOptionClicked: vi.fn()
};

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Navigation', () => {
  describe('link visibility', () => {
    it('shows only Dashboard for unauthenticated users', () => {
      renderInRouter(<Navigation {...baseProps} authentication={null} />);
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Scenarios' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Cohorts' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    });

    it('shows authenticated links but not Users for non-admins', () => {
      renderInRouter(<Navigation {...baseProps} authentication={{ role: 'USER', firstName: 'Sam' }} />);
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Scenarios' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Cohorts' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'History' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    });

    it('shows the Users link for ADMIN users', () => {
      renderInRouter(<Navigation {...baseProps} authentication={{ role: 'ADMIN', firstName: 'Admin' }} />);
      expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
    });

    it('shows the Users link for SUPER_ADMIN users', () => {
      renderInRouter(<Navigation {...baseProps} authentication={{ role: 'SUPER_ADMIN', firstName: 'Super' }} />);
      expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
    });
  });

  describe('login/user menu', () => {
    it('renders a Login button when not authenticated', async () => {
      const user = userEvent.setup();
      const onLoginClicked = vi.fn();
      renderInRouter(<Navigation {...baseProps} onLoginClicked={onLoginClicked} authentication={null} />);

      await user.click(screen.getByRole('button', { name: 'Login' }));
      expect(onLoginClicked).toHaveBeenCalledTimes(1);
    });

    it('renders the user dropdown with the user display name when authenticated', () => {
      renderInRouter(<Navigation {...baseProps} authentication={{ role: 'USER', firstName: 'Sam' }} />);
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      expect(screen.getAllByText('Sam')[0]).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    });
  });

  describe('mobile menu', () => {
    it('does not render the mobile toggle button when unauthenticated', () => {
      renderInRouter(<Navigation {...baseProps} authentication={null} />);
      expect(screen.queryByRole('button', { name: 'Toggle menu' })).not.toBeInTheDocument();
    });

    it('renders the mobile toggle button when authenticated', async () => {
      const user = userEvent.setup();
      const onMobileMenuToggle = vi.fn();
      renderInRouter(
        <Navigation
          {...baseProps}
          onMobileMenuToggle={onMobileMenuToggle}
          authentication={{ role: 'USER', firstName: 'Sam' }}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Toggle menu' }));
      expect(onMobileMenuToggle).toHaveBeenCalledTimes(1);
    });

    it('does not render the mobile menu panel when isMobileMenuOpen is false', () => {
      renderInRouter(
        <Navigation
          {...baseProps}
          isMobileMenuOpen={false}
          authentication={{ role: 'USER', firstName: 'Sam' }}
        />
      );
      expect(screen.getAllByRole('link', { name: 'Dashboard' })).toHaveLength(1);
    });

    it('renders the mobile menu panel when isMobileMenuOpen is true and user is authenticated', () => {
      renderInRouter(
        <Navigation
          {...baseProps}
          isMobileMenuOpen={true}
          authentication={{ role: 'USER', firstName: 'Sam' }}
        />
      );
      expect(screen.getAllByRole('link', { name: 'Dashboard' })).toHaveLength(2);
      expect(screen.getAllByRole('button', { name: 'Logout' }).length).toBeGreaterThan(0);
    });

    it('does not render the mobile menu panel when unauthenticated even if isMobileMenuOpen is true', () => {
      renderInRouter(<Navigation {...baseProps} isMobileMenuOpen={true} authentication={null} />);
      expect(screen.getAllByRole('link', { name: 'Dashboard' })).toHaveLength(1);
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });
  });

  describe('logout', () => {
    it('toggles the mobile menu and triggers logout when the logout button is clicked', async () => {
      const user = userEvent.setup();
      const onMobileMenuToggle = vi.fn();
      const onUserMenuOptionClicked = vi.fn();
      renderInRouter(
        <Navigation
          {...baseProps}
          isMobileMenuOpen={true}
          authentication={{ role: 'USER', firstName: 'Sam' }}
          onMobileMenuToggle={onMobileMenuToggle}
          onUserMenuOptionClicked={onUserMenuOptionClicked}
        />
      );

      const logoutButtons = screen.getAllByRole('button', { name: 'Logout' });
      await user.click(logoutButtons[0]);

      expect(onMobileMenuToggle).toHaveBeenCalledTimes(1);
      expect(onUserMenuOptionClicked).toHaveBeenCalledWith('logout');
    });
  });

  it('dims the navigation when logging out', () => {
    const { container } = renderInRouter(
      <Navigation {...baseProps} isLoggingOut={true} authentication={{ role: 'USER', firstName: 'Sam' }} />
    );
    expect(container.querySelector('.opacity-60')).toBeInTheDocument();
  });
});
