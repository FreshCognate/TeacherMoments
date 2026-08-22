import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-focus-lock', () => ({
  default: ({ children }) => <div>{children}</div>
}));

import DialogModal from '../components/dialogModal';

const renderModal = (modal) => render(
  <DialogModal
    modal={modal}
    modalData={{}}
    renderKey="1"
    onActionClicked={() => {}}
    onFormUpdate={() => {}}
    onCloseButtonClicked={() => {}}
  />
);

describe('DialogModal focus', () => {

  it('leaves focus on a field inside the dialog that autofocused itself', () => {
    renderModal({ component: <textarea autoFocus aria-label="answer" /> });

    expect(document.activeElement).toBe(screen.getByLabelText('answer'));
  });

  it('takes focus itself when nothing inside claimed it', () => {
    renderModal({ component: <div>No fields here</div> });

    expect(document.activeElement).toHaveAttribute('tabindex', '0');
  });

});
