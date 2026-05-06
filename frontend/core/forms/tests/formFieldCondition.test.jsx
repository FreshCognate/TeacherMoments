import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FormFieldCondition from '../components/formFieldCondition.jsx';

describe('FormFieldCondition', () => {
  it('returns null when hasCondition is false', () => {
    const { container } = render(
      <FormFieldCondition hasCondition={false} condition={{ error: 'x' }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the condition.error as HTML when hasCondition is true', () => {
    const { container } = render(
      <FormFieldCondition hasCondition condition={{ error: '<strong>blocked</strong>' }} />
    );
    expect(container.querySelector('strong')).toHaveTextContent('blocked');
  });
});
