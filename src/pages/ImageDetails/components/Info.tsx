import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
//import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Transition, Button } from '../../../components';
import { Image } from '../../../types/Image.types';

function Info({ image }: { image: Image }) {
  const { name,  negative_prompt ,date_created, prompt} = image;
  const [isExpanded, setIsExpanded] = useState(false);
 // const scrollTo = useScrollTo();

  const date = new Date(date_created)
  const formatted_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return (
    <Transition className="Info">
      <div className="About">
        <h4>About</h4>
        <p>Title: {name}</p>
        <p>Prompt:{prompt}</p>
        <p>Negative prompt: {negative_prompt}</p>
        <p>Date Created: {formatted_date}</p>
      </div>
      <motion.div
        className=""
        initial={false}
        animate={{ minHeight: isExpanded ? '320px' : '60px' }}
      >
      </motion.div>
    </Transition>
  );
}

export default Info;
