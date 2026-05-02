import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardContent from './cardContent.jsx';

describe('CardContent', () => {
  it('renders its children', () => {
    render(
      <CardContent>
        <p>Body text</p>
      </CardContent>
    );
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });
});
