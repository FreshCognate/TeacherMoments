import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

const openLoginModalMock = vi.fn();
vi.mock('~/modules/authentication/helpers/openLoginModal', () => ({
  default: () => openLoginModalMock()
}));

let capturedProps: any = null;
vi.mock('../components/landing', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="landing-stub" />;
  }
}));

import LandingContainer from '../containers/landingContainer';

describe('LandingContainer', () => {
  it('wires openLoginModal as the onAuthClicked handler', () => {
    render(<LandingContainer />);
    expect(capturedProps.onAuthClicked).toBeTypeOf('function');

    capturedProps.onAuthClicked();
    expect(openLoginModalMock).toHaveBeenCalledTimes(1);
  });
});
