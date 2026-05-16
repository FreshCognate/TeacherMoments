import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioRecorder from '../components/audioRecorder.jsx';

const baseProps = {
  status: 'idle',
  startRecording: () => {},
  stopRecording: () => {},
  clearBlobUrl: () => {},
  onRemoveAudioClicked: () => {},
  onPermissionDenied: () => {}
};

describe('AudioRecorder', () => {
  it('shows the default prompt when no recording is in progress and there is no audio', () => {
    render(<AudioRecorder {...baseProps} />);
    expect(screen.getByText('Press microphone to start recording...')).toBeInTheDocument();
  });

  it('shows "Press microphone to stop recording" when status is "recording"', () => {
    render(<AudioRecorder {...baseProps} status="recording" />);
    expect(screen.getByText('Press microphone to stop recording')).toBeInTheDocument();
  });

  it('shows "Audio saved..." when audioSrc is provided', () => {
    render(<AudioRecorder {...baseProps} audioSrc="blob:abc" />);
    expect(screen.getByText('Audio saved. Press record to try again.')).toBeInTheDocument();
  });

  it('shows "Uploading audio" when isUploadingAudio is true', () => {
    render(<AudioRecorder {...baseProps} isUploadingAudio uploadProgress={42} />);
    expect(screen.getByText('Uploading audio')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('uploadStatus overrides other status text when provided', () => {
    render(<AudioRecorder {...baseProps} status="recording" uploadStatus="Processing..." />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('Press microphone to stop recording')).not.toBeInTheDocument();
  });

  it('calls startRecording when the record button is clicked and status is not "recording"', async () => {
    const user = userEvent.setup();
    const startRecording = vi.fn();

    render(<AudioRecorder {...baseProps} startRecording={startRecording} />);
    await user.click(screen.getAllByRole('button')[0]);

    expect(startRecording).toHaveBeenCalledTimes(1);
  });

  it('calls stopRecording when the record button is clicked and status is "recording"', async () => {
    const user = userEvent.setup();
    const stopRecording = vi.fn();

    render(<AudioRecorder {...baseProps} status="recording" stopRecording={stopRecording} />);
    await user.click(screen.getAllByRole('button')[0]);

    expect(stopRecording).toHaveBeenCalledTimes(1);
  });

  it('disables the record button when isDisabled is true', () => {
    render(<AudioRecorder {...baseProps} isDisabled />);
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  it('renders an audio element when audioSrc is provided', () => {
    const { container } = render(<AudioRecorder {...baseProps} audioSrc="blob:abc" />);
    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute('src', 'blob:abc');
  });

  it('renders a delete button when audioSrc is provided', () => {
    render(<AudioRecorder {...baseProps} audioSrc="blob:abc" />);
    expect(screen.getByTitle('Delete audio')).toBeInTheDocument();
  });
});
