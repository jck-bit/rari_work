import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import {
  RiAddLine,
  RiCheckLine,
  RiDeleteBin2Fill
} from 'react-icons/ri';
import { Transition, Button } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../types/Image.types';


interface Props {
  image: Image;
  cartItems: Image[];
  addToCart: (game: Image) => void;
}

function GameCard(props: Props) {
  const {
    image,
    cartItems,
    addToCart,
  } = props;
  const {
    id,
    
    image_url
  } = image;
  
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const navigateToGame = () => navigate(`/images/${id}`);

  return (
    <div className="GameCard">
      <motion.div
        className="Image"
      //  whileHover={{ height: 180 }}
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
        whileHover={{ height: 150 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="Price">
          {cartItems.find((item) => item.id === id)
            ? <Transition className="Added">Saved <RiCheckLine /></Transition>
            : <Button handleClick={() => addToCart(image)}>
              save Image <RiAddLine />
            </Button>
          }
          <div className='Delete'>
            <Button type="delete" className='Delete'>
              Delete Image <RiDeleteBin2Fill/>
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <Transition className="MoreInfo">  
              <div>
                <Button handleClick={navigateToGame}>View Image Prompt</Button>
              </div>
            </Transition>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default GameCard;
