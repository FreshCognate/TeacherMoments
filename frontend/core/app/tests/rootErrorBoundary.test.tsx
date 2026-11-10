import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ErrorBoundary } from '../../../root';

const routeError = (status: number, statusText: string) => ({
  status,
  statusText,
  internal: true,
  data: ''
});

const renderBoundary = (error: unknown) => render(
  <MemoryRouter>
    <ErrorBoundary {...({ error } as any)} />
  </MemoryRouter>
);

describe('root ErrorBoundary', () => {
  it('links a page that does not exist to the home page', () => {
    renderBoundary(routeError(404, 'Not Found'));
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByText(/Check the address, or go to the/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'home page' })).toHaveAttribute('href', '/');
  });

  it('keeps the status text for other route errors', () => {
    renderBoundary(routeError(500, 'Server Error'));
    expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument();
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'home page' })).not.toBeInTheDocument();
  });
});
