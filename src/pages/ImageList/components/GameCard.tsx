import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import { RiAddLine, RiCheckLine, RiDeleteBin2Fill } from 'react-icons/ri';
import { Transition, Button } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../types/Image.types';

interface Props {
  image: Image;
  cartItems: Image[];
  addToCart: (image: Image) => void;
  handleDeleteImage: (id: number) => void; // Add this prop
}

const GameCard: React.FC<Props> = ({ image, cartItems, addToCart, handleDeleteImage }) => {
  const { id, image_url } = image;
  const [, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const navigateToGame = () => navigate(`/images/${id}`);

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
          {cartItems.find((item) => item.id === id)
            ? <Transition className="Added">Saved <RiCheckLine /></Transition>
            : <Button handleClick={() => addToCart(image)}>
              Save Image <RiAddLine />
            </Button>
          }
          <div className='Delete'>
            <Button type="button" className='Delete' handleClick={() => handleDeleteImage(id)}>
              Delete Image <RiDeleteBin2Fill />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GameCard;
