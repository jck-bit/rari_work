import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from './components/Grid';
import { Image } from '../../types/Image.types';
import NavBar from '../../components/Navbar';

interface Props {
  cartItems: Image[];
  addToCart: (image: Image) => void;
}

const minCardWidth = 330;
let scrollY = 0;

function ImageList({ cartItems, addToCart }: Props) {
  const [images, setImages] = useState<Image[] | null>(null);
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
    const fetchPhotos = async () => {
      try {
        const loadPhotos = await fetch('https://jsonplaceholder.typicode.com/photos/');
        const response = await loadPhotos.json();
        console.log('Fetched photos:', response);
        const photos = response.slice(0, 50) as Image[];
        console.log('Selected photos:', photos);
        setImages(photos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    if (location.pathname === '/images') {
      if (location.search) {
        ({ scrollY } = window);
        scrollTo();
        fetchPhotos();
      } else {
        scrollTo(scrollY);
        fetchPhotos();
      }
    }
  }, []);

  console.log('Images state:', images);

  return (
    <Transition className="GameList" direction="right">
      <NavBar
        showStoreButton={!!location.search}
        title={searchParams.get('search') || 'Images Available'}
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
