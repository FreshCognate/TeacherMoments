import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './card.jsx';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <span>Hello card</span>
      </Card>
    );
    expect(screen.getByText('Hello card')).toBeInTheDocument();
  });
});
