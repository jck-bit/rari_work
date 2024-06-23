import { useEffect, useState, useCallback } from 'react';
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
  const { images, deleteImage } = useImages(); // Get images from context
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
    if (!isPresent) {
      scrollY = window.scrollY;
    }
  }, [isPresent]);

  const handleDeleteImage = useCallback(
    async (id: number) => {
      scrollY = window.scrollY;
      await deleteImage(id);
      // Scroll to the saved position after deleting the image
      window.scrollTo(0, scrollY);
    },
    [deleteImage]
  );

  useEffect(() => {
    if (location.pathname === '/images') {
      if (location.search) {
        scrollY = window.scrollY;
        scrollTo();
      } else {
        scrollTo(scrollY);
      }
    }
  }, [location, scrollTo]);

  // Additional useEffect to restore scroll position after state changes
  useEffect(() => {
    window.scrollTo(0, scrollY);
  }, [images]);

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
              handleDeleteImage={handleDeleteImage} // Pass this prop
            />
          : <Transition className="NoGames">No Images found.</Transition>
        : <Loading />
      }
    </Transition>
  );
}

export default ImageList;
