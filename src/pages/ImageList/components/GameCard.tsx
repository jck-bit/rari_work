import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import {
  RiAddLine,
  RiCheckLine,
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
    
    url
  } = image;
  
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const navigateToGame = () => navigate(`/images/${id}`);

  return (
    <div className="GameCard">
      <motion.div
        className="Image"
        whileHover={{ height: 180 }}
        onClick={navigateToGame}
      >
        
        <BackgroundImage
          className="BackgroundImage"
          wrapperClassName="Wrapper"
          src={url || ''}
          transitionTime="1s"
          isResponsive
          lazyLoad
        />
      </motion.div>
      <motion.div
        className="Info"
        whileHover={{ height: 180 }}
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
          
        </div>
        <Button className="Name" handleClick={navigateToGame}>
          {""}
        </Button>
        <AnimatePresence>
          {isHovered && (
            <Transition className="MoreInfo">
              {/* {parent_platforms && <div className="Platforms">
                {parent_platforms.map(({ platform }) => (
                  <div key={`${platform.id}-${id}`} title={platform.name}>
                    {platformIcons[platform.slug]}
                  </div>
                ))}
              </div>} */}
              {/* <div className="Released">Released: {releasedDate}</div>
              <div className="Genres">Genres: {genreList}</div> */}
              <div>Image prompt will come here</div>
            </Transition>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default GameCard;
