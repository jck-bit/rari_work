import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from '../ImageList/components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';

const minCardWidth = 330;
let scrollY = 0;

const SavedImages: React.FC = () => {
  const { savedImages, fetchSavedImages, deleteImage, saveImageToSaved } = useImages();
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

  useEffect(() => {
    fetchSavedImages();
  }, [fetchSavedImages]);

  const handleDeleteImage = useCallback(
    async (id: number) => {
      const currentScrollY = window.scrollY;  
      await deleteImage(id);
      window.scrollTo(0, currentScrollY);
    },
    [deleteImage]
  );

  const handleSaveImage = useCallback(
    async (id: number) => {
      const currentScrollY = window.scrollY; 
      await saveImageToSaved(id);
      window.scrollTo(0, currentScrollY);
    },
    [saveImageToSaved]
  );

  useEffect(() => {
    if (location.pathname === '/save-images') {
      if (location.search) {
        scrollY = window.scrollY;
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
      {savedImages.length ? (
        <Grid
          images={savedImages}
          columnsCount={columnsCount}
          handleDeleteImage={handleDeleteImage}
          handleSaveImage={handleSaveImage} // Pass handleSaveImage to Grid
        />
      ) : (
        <Loading />
      )}
    </Transition>
  );
};

export default SavedImages;
