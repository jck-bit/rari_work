import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Transition, Button } from '../../../components';
import { Image } from '../../../types/Image.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Info({image}: {image: Image}) {

    const {
      title,
      thumbnailUrl
    } = image;

  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTo = useScrollTo();

  return (
    <Transition className="Info">
      <div className="About">
        <h4>About</h4>
         
      </div>
      <motion.div
        className="MoreInfo"
        initial={false}
        animate={{ minHeight: isExpanded ? '220px' : '60px' }}
      >
        {isExpanded
          ? <>
            <Transition
              key="expanded"
              className="Expanded"
              direction="up"
              distance={30}
            >
              {/* <a href={image} target="_blank" rel="noreferrer">
                {title}
              </a> */}

              
              <p>Title: {title}</p>
              <p>ThumbnailUrl: {thumbnailUrl}</p>
              <p>Date Created: {new Date().toLocaleDateString()}</p>
            </Transition>
            <motion.div className="Expand" layoutId="expand-button">
              <Button handleClick={() => setIsExpanded(false)}>
                Hide <RiArrowUpSLine />
              </Button>
            </motion.div>
          </>
          : <motion.div className="Expand" layoutId="expand-button">
            <Button handleClick={() => {
              setIsExpanded(true);
              scrollTo(10000);
            }}>
              More <RiArrowDownSLine />
            </Button>
          </motion.div>
        }
      </motion.div>
    </Transition>
  );
}

export default Info;
