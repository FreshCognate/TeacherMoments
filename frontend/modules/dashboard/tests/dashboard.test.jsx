import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/dashboard';

describe('Dashboard', () => {
  it('renders the welcome heading', () => {
    render(<Dashboard />);
    expect(screen.getByText('Welcome to Teacher Moments 2.0')).toBeInTheDocument();
  });

  it('renders the launch timeline section', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Launch Timeline/)).toBeInTheDocument();
    expect(screen.getByText(/Full access begins Early Spring 2026/)).toBeInTheDocument();
  });

  it('renders the "What\'s New" section', () => {
    render(<Dashboard />);
    expect(screen.getByText(/What.s New in Version 2.0/)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Coaching/)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced Performance & Security/)).toBeInTheDocument();
    expect(screen.getByText(/Streamlined Interface/)).toBeInTheDocument();
  });
});
