import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import { RiAddLine, RiCheckLine, RiDeleteBin4Fill , RiDownload2Fill, RiLoader4Line } from 'react-icons/ri'; // Added RiLoader4Line icon
import { Transition, Button } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../types/Image.types';
import { useImages } from '../../../context/ImageContext';

interface Props {
  image: Image;
  handleDeleteImage: (id: number) => void;
  handleSaveImage: (id: number) => void;
}

const ImageCard: React.FC<Props> = ({ image, handleDeleteImage, handleSaveImage }) => {
  const { id, image_url,name } = image;
  const [, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const navigateToGame = () => navigate(`/images/${id}`);
  const { savedImages } = useImages();

  const isSaved = savedImages.some(savedImage => savedImage.id === id);

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = image_url;
    link.download = name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDeleteClick = async (id: number) => {
    setIsDeleting(true);
    await handleDeleteImage(id);
    setIsDeleting(false);
  };

  const handleSaveClick = async (id: number) => {
    setIsSaving(true);
    await handleSaveImage(id);
    setIsSaving(false);
  };

  return (
    <div className="GameCard">
      <motion.div
        className="Image"
        onClick={navigateToGame}
      >
        <BackgroundImage
          className="BackgroundImage"
          wrapperClassName="Wrapper"
          src={image_url || ''}
          transitionTime="1s"
          isResponsive
          lazyLoad
        />
      </motion.div>
      <motion.div
        className="Info"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="Price">
          {isSaved ? (
            <Transition className="Added">Saved <RiCheckLine /></Transition>
          ) : isSaving ? (
            <Button>
              Saving <RiLoader4Line className="spin" />
            </Button>
          ) : (
            <Button handleClick={() => handleSaveClick(id)}>
              Save Image <RiAddLine />
            </Button>
          )}
          <div className='Delete'>
            {isDeleting ? (
              <Button type="button" className='Delete'>
                Deleting <RiLoader4Line className="spin" />
              </Button>
            ) : (
              <Button type="button" className='Delete' handleClick={() => handleDeleteClick(id)}>
                Delete Image <RiDeleteBin4Fill  />
              </Button>
            )}
          </div>
          <Button type="button" className='Download' handleClick={handleDownloadImage}>
            <RiDownload2Fill />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageCard;
