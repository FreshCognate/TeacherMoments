import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FormFieldHelp from './formFieldHelp.jsx';

describe('FormFieldHelp', () => {
  it('returns null when no help is provided', () => {
    const { container } = render(<FormFieldHelp help="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the help text as HTML', () => {
    const { container } = render(<FormFieldHelp help="<em>Note</em>" />);
    expect(container.querySelector('em')).toHaveTextContent('Note');
  });
});
