// src/components/ImageList/ImageList.tsx
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from './components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';
import { Image } from '../../types/Image.types';

interface Props {
  cartItems: Image[];
  addToCart: (image: Image) => void;
}

const minCardWidth = 330;
let scrollY = 0;

function ImageList({ cartItems, addToCart }: Props) {
  const { images } = useImages(); // Get images from context
  const [columnsCount, setColumnsCount] = useState(1);
  const windowWidth = useWindowWidth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const scrollTo = useScrollTo();
  const isPresent = useIsPresent();

  useEffect(() => {
    setColumnsCount(Math.floor(windowWidth / minCardWidth) || 1);
  }, [windowWidth]);

  useEffect(() => {
    !isPresent && ({ scrollY } = window);
  }, [isPresent]);

  useEffect(() => {
    if (location.pathname === '/images') {
      if (location.search) {
        ({ scrollY } = window);
        scrollTo();
      } else {
        scrollTo(scrollY);
      }
    }
  }, [location, scrollTo]);

  return (
    <Transition className="GameList" direction="right">
      <NavBar
        showStoreButton={!!location.search}
        title={searchParams.get('search') || ''}
      />
      {images
        ? images.length
          ? <Grid
              images={images}
              cartItems={cartItems}
              addToCart={addToCart}
              columnsCount={columnsCount}
            />
          : <Transition className="NoGames">No Images found.</Transition>
        : <Loading />
      }
    </Transition>
  );
}

export default ImageList;
