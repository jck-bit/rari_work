import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from '../ImageList/components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';
import { RiDeleteBin6Line  } from 'react-icons/ri'; 
import { MdCancel  } from "react-icons/md";

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

  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    setColumnsCount(Math.floor(windowWidth / minCardWidth) || 1);
  }, [windowWidth]);

  useEffect(() => {
    if (!isPresent) {
      scrollY = window.scrollY;
    }
  }, [isPresent]);

  useEffect(() => {
    scrollY = window.scrollY;
      fetchSavedImages();
    window.scrollTo(0, scrollY);
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

  const handleDeleteSelectedImages = useCallback(async () => {
    scrollY = window.scrollY;
    await Promise.all(selectedImages.map(id => deleteImage(id)));
    setSelectedImages([]);
    setSelectionMode(false);
    window.scrollTo(0, scrollY);
  }, [selectedImages, deleteImage]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSaveSelectedImages = useCallback(async () => {
    scrollY = window.scrollY;
    await Promise.all(selectedImages.map(id => saveImageToSaved(id)));
    setSelectedImages([]);
    setSelectionMode(false);
    window.scrollTo(0, scrollY);
  }, [selectedImages, saveImageToSaved]);

  const handleSelectImage = useCallback((id: number) => {
    setSelectedImages(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  }, []);

  const handleLongPress = useCallback(() => {
    setSelectionMode(true);
  }, []);

  const handleCancelSelection = () => {
    setSelectedImages([]);
    setSelectionMode(false);
  };

  useEffect(() => {
    if (location.pathname === '/saved-images') {
      if (location.search) {
        scrollY = window.scrollY;
        scrollTo();
      } else {
        scrollTo(scrollY);
      }
    }
  }, [location, scrollTo]);

  const getSelectedImagesCount  = () => selectedImages.length;

  return (
    <Transition className="GameList" direction="right">
      <NavBar
        showStoreButton={!!location.search}
        title={searchParams.get('search') || ''}
      />
      {selectionMode && (
        <div className="BulkActions">
        <div className='cancel-selection' onClick={handleCancelSelection}>
          <MdCancel  size={25} color='white' className='circle'/> 
        </div>

        <div className='selected-image'>
           {getSelectedImagesCount()} selected
        </div>

        <div className='delete-me' onClick={handleDeleteSelectedImages}>
            <RiDeleteBin6Line size={25} color='white' className='delete'/>
          </div>
      </div>
      )}
      {savedImages.length ? (
        <Grid
          images={savedImages}
          columnsCount={columnsCount}
          handleDeleteImage={handleDeleteImage}
          handleSaveImage={handleSaveImage}
          handleSelectImage={handleSelectImage}
          selectedImages={selectedImages}
          selectionMode={selectionMode}
          handleLongPress={handleLongPress}
        />
      ) : (
        <Loading />
      )}
    </Transition>
  );
};

export default SavedImages;
