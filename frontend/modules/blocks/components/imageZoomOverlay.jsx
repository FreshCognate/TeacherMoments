import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import DialogModalLightbox from '~/core/dialogs/components/dialogModalLightbox';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Image from '~/uikit/content/components/image';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';

const ImageZoomOverlay = ({
  asset,
  shape,
  borderRadius,
  onClose
}) => {
  if (!asset || !asset._id) return null;

  const imageSrc = getAssetUrl(asset, 'original');

  return createPortal(
    <div className="fixed inset-0 z-50">
      <DialogModalLightbox>
        <motion.div
          className="relative w-full h-full overflow-auto z-50"
          onClick={onClose}
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.96 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ ease: 'linear', duration: 0.2 }}
        >
          <div className="min-h-full flex justify-center items-center p-8">
            <div className="w-[min(90vw,960px)]">
              <Image
                src={imageSrc}
                shape={shape}
                borderRadius={borderRadius}
              />
            </div>
          </div>
        </motion.div>
        <FlatButton
          className="absolute right-4 top-4 z-50"
          icon="cancel"
          onClick={onClose}
        />
      </DialogModalLightbox>
    </div>,
    document.body
  );
};

export default ImageZoomOverlay;
