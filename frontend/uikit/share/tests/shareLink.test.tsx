import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareLink from './shareLink';

describe('ShareLink', () => {
  it('renders the share link', () => {
    render(<ShareLink shareLink="https://example.com/share/abc" />);
    expect(screen.getByText('https://example.com/share/abc')).toBeInTheDocument();
  });

  it('writes the share link to the clipboard and shows the "Copied!" feedback when copy is clicked', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<ShareLink shareLink="https://example.com/share/abc" />);

    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('https://example.com/share/abc');
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
