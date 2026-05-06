import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssetSelectorDisplayFormField from './assetSelectorDisplay.formField.jsx';

describe('AssetSelectorDisplayFormField', () => {
  it('renders nothing when there is no file and no asset', () => {
    const { container } = render(<AssetSelectorDisplayFormField />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the in-progress upload UI from the local file (preview, "Uploading", progress)', () => {
    const file = { preview: 'blob:abc', progress: 42, type: 'image/png' };

    render(<AssetSelectorDisplayFormField file={file} isUploading />);

    expect(screen.getByText('Uploading')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders the asset name and a remove button once the asset is finalised', async () => {
    const user = userEvent.setup();
    const onRemoveAssetClicked = vi.fn();
    const asset = {
      _id: 'a1',
      name: 'photo.png',
      fileType: 'image',
      extension: 'png',
      isUploading: false,
      hasBeenProcessed: false
    };

    render(
      <AssetSelectorDisplayFormField asset={asset} onRemoveAssetClicked={onRemoveAssetClicked} />
    );

    expect(screen.getByText('photo.png')).toBeInTheDocument();

    const removeButton = screen.getByTitle('Remove asset');
    expect(removeButton).toBeInTheDocument();

    await user.click(removeButton);
    expect(onRemoveAssetClicked).toHaveBeenCalledTimes(1);
  });

  it('shows "Processing" when isProcessing is true', () => {
    const asset = {
      _id: 'a1',
      name: 'photo.png',
      fileType: 'image',
      extension: 'png',
      isUploading: false
    };

    render(<AssetSelectorDisplayFormField asset={asset} isProcessing />);
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('renders an <img> tag for image file types', () => {
    const file = { preview: 'blob:abc', progress: 0, type: 'image/png' };
    const { container } = render(<AssetSelectorDisplayFormField file={file} isUploading />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders a <video> tag for video file types', () => {
    const file = { preview: 'blob:abc', progress: 0, type: 'video/mp4' };
    const { container } = render(<AssetSelectorDisplayFormField file={file} isUploading />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });
});
