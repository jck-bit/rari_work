import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Transition, Button } from '../../../components';
import { Image } from '../../../types/Image.types';

function Info({ image }: { image: Image }) {
  const { title, url } = image;
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTo = useScrollTo();

  return (
    <Transition className="Info">
      <div className="About">
        <h4>About</h4>
        <p>Title: {title}</p>
      </div>
      <motion.div
        className="MoreInfo"
        initial={false}
        animate={{ minHeight: isExpanded ? '220px' : '60px' }}
      >
        {isExpanded ? (
          <>
            <Transition
              key="expanded"
              className="Expanded"
              direction="up"
              distance={30}
            >
              <a href={url} target="_blank" rel="noreferrer">
                View Image
              </a>
              <p>Title: {title}</p>
              <p>Date Created: {new Date().toLocaleDateString()}</p>
            </Transition>
            <motion.div className="Expand" layoutId="expand-button">
              <Button handleClick={() => setIsExpanded(false)}>
                Hide <RiArrowUpSLine />
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div className="Expand" layoutId="expand-button">
            <Button
              handleClick={() => {
                setIsExpanded(true);
                scrollTo(10000);
              }}
            >
              More <RiArrowDownSLine />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Transition>
  );
}

export default Info;
