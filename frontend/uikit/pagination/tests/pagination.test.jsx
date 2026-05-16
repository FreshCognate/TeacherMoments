import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/pagination.jsx';

describe('Pagination', () => {
  it('renders the current and total page label', () => {
    render(<Pagination currentPage={2} totalPages={5} onClick={() => {}} />);
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('disables the previous button on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onClick={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onClick={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('fires onClick("down") when the previous button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Pagination currentPage={3} totalPages={5} onClick={onClick} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onClick).toHaveBeenCalledWith('down');
  });

  it('fires onClick("up") when the next button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Pagination currentPage={3} totalPages={5} onClick={onClick} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(onClick).toHaveBeenCalledWith('up');
  });
});
