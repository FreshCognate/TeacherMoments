import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetSelectorFormField from './assetSelector.formField.jsx';

const noop = () => {};

describe('AssetSelectorFormField', () => {
  it('shows the upload dropzone when no file or asset is selected', () => {
    render(
      <AssetSelectorFormField
        accepts={{ 'image/png': [] }}
        onDrop={noop}
        onDropRejected={noop}
      />
    );
    expect(screen.getByText('Drop to upload')).toBeInTheDocument();
  });

  it('hides the dropzone once an asset is selected', () => {
    const asset = {
      _id: 'a1',
      name: 'photo.png',
      fileType: 'image',
      extension: 'png',
      isUploading: false
    };

    render(
      <AssetSelectorFormField
        value={asset}
        accepts={{ 'image/png': [] }}
        onDrop={noop}
        onDropRejected={noop}
      />
    );
    expect(screen.queryByText('Drop to upload')).not.toBeInTheDocument();
  });

  it('hides the dropzone while a file is being uploaded', () => {
    render(
      <AssetSelectorFormField
        accepts={{ 'image/png': [] }}
        acceptedFile={{ preview: 'blob:abc', progress: 10, type: 'image/png' }}
        isUploading
        onDrop={noop}
        onDropRejected={noop}
      />
    );
    expect(screen.queryByText('Drop to upload')).not.toBeInTheDocument();
  });

  it('renders the error text when hasError is true', () => {
    render(
      <AssetSelectorFormField
        accepts={{ 'image/png': [] }}
        hasError
        error="File too large"
        onDrop={noop}
        onDropRejected={noop}
      />
    );
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('does not render error text when hasError is false', () => {
    render(
      <AssetSelectorFormField
        accepts={{ 'image/png': [] }}
        hasError={false}
        error="ignored"
        onDrop={noop}
        onDropRejected={noop}
      />
    );
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });
});
