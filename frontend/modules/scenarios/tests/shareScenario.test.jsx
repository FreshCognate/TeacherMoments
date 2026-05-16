import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareScenario from '../components/shareScenario';

const baseProps = {
  scenario: { isPublished: false, hasChanges: false },
  publishLink: 'https://teachermoments.org/p/abc',
  isPublishing: false,
  hasCopied: false,
  isScenarioValid: true,
  onPublishScenarioClicked: () => {},
  onCopyLinkClicked: () => {}
};

describe('ShareScenario', () => {
  it('renders the publish link and copy button when the scenario is published', () => {
    render(
      <ShareScenario
        {...baseProps}
        scenario={{ isPublished: true, hasChanges: false }}
      />
    );
    expect(screen.getByRole('button', { name: 'Copy link' })).toBeInTheDocument();
    expect(screen.getByText('https://teachermoments.org/p/abc')).toBeInTheDocument();
  });

  it('does not render the copy link button when the scenario is unpublished', () => {
    render(<ShareScenario {...baseProps} />);
    expect(screen.queryByRole('button', { name: 'Copy link' })).not.toBeInTheDocument();
  });

  it('renders the "Copied!" indicator when hasCopied is true', () => {
    render(
      <ShareScenario
        {...baseProps}
        scenario={{ isPublished: true, hasChanges: false }}
        hasCopied={true}
      />
    );
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('renders the "draft changes" copy when hasChanges is true and not publishing', () => {
    render(
      <ShareScenario
        {...baseProps}
        scenario={{ isPublished: true, hasChanges: true }}
      />
    );
    expect(
      screen.getByText('This scenario has draft changes that have not been published.')
    ).toBeInTheDocument();
  });

  it('renders the "all published" copy when there are no changes and not publishing', () => {
    render(<ShareScenario {...baseProps} />);
    expect(screen.getByText('All changes are published.')).toBeInTheDocument();
  });

  it('renders the "Publishing..." copy when isPublishing is true', () => {
    render(<ShareScenario {...baseProps} isPublishing={true} />);
    expect(screen.getByText('Publishing...')).toBeInTheDocument();
  });

  it('renders the validation warning when there are draft changes but the scenario is invalid', () => {
    render(
      <ShareScenario
        {...baseProps}
        scenario={{ isPublished: true, hasChanges: true }}
        isScenarioValid={false}
      />
    );
    expect(
      screen.getByText('Scenarios cannot be published whilst there are issues')
    ).toBeInTheDocument();
  });

  it('disables the Publish button when the scenario is invalid', () => {
    render(<ShareScenario {...baseProps} isScenarioValid={false} />);
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('disables the Publish button when isPublishing is true', () => {
    render(<ShareScenario {...baseProps} isPublishing={true} />);
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('fires onPublishScenarioClicked when the Publish button is clicked', async () => {
    const user = userEvent.setup();
    const onPublishScenarioClicked = vi.fn();

    render(<ShareScenario {...baseProps} onPublishScenarioClicked={onPublishScenarioClicked} />);
    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(onPublishScenarioClicked).toHaveBeenCalledTimes(1);
  });

  it('fires onCopyLinkClicked when the copy link button is clicked', async () => {
    const user = userEvent.setup();
    const onCopyLinkClicked = vi.fn();

    render(
      <ShareScenario
        {...baseProps}
        scenario={{ isPublished: true, hasChanges: false }}
        onCopyLinkClicked={onCopyLinkClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(onCopyLinkClicked).toHaveBeenCalledTimes(1);
  });
});
