import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ImageModal } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ image, onClose }) => {
  useEffect(() => {
    const handleCloseEsc = evt => {
      if (evt.code === 'Escape') {
        onClose();
        return;
      }
    };
    document.addEventListener('keydown', handleCloseEsc);
    return () => {
      document.removeEventListener('keydown', handleCloseEsc);
    };
  }, [onClose]);

  const handleBackdropClick = evt => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ImageModal>
        <img src={image.largeImageURL} alt={image.tags} />
      </ImageModal>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  onClick: PropTypes.func,
  src: PropTypes.string,
  alt: PropTypes.string,
};
