import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from '../ImageList/components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';
import { RiDeleteBin6Line, RiDownload2Fill } from 'react-icons/ri';
import { MdCancel } from "react-icons/md";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const minCardWidth = 330;
let scrollY = 0;

const SavedImages: React.FC = () => {
  const { savedImages, fetchSavedImages, deleteImage, saveImageToSaved } = useImages();
  const [columnsCount, setColumnsCount] = useState(1);
  const windowWidth = useWindowWidth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
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
    fetchSavedImages();
  }, []);


  useEffect(() => {
    if (location.pathname === '/saved-images') {
      if (location.search) {
        window.scrollTo(0, scrollY);
      } else {
        window.scrollTo(0, scrollY);
      }
    }
  }, [location]);

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

 const handleDownloadSelectedImages  = () => {
  const zip = new JSZip();
  const folder = zip.folder("SelectedImages"); // Create a folder in the ZIP file

  // Add selected images to the folder
  selectedImages.forEach((id) => {
    const photo = savedImages.find(img => img.id === id);
    if (photo) {
      const blobPromise = fetch(photo.image_url).then((res) => res.blob());
      folder?.file(photo.name, blobPromise, { binary: true });
    }
  });

  // Zip the folder and trigger download
  zip.generateAsync({ type: "blob" }).then((blob) => {
    saveAs(blob, "SelectedImages.zip");
  });
};

  
  

  const getSelectedImagesCount = () => selectedImages.length;

  return (
    <Transition className="GameList" direction="right">
      <NavBar
        showStoreButton={!!location.search}
        title={searchParams.get('search') || ''}
      />
      {selectionMode && (
        <div className="BulkActions">
          <div className='cancel-selection' onClick={handleCancelSelection}>
            <MdCancel size={25} color='white' className='circle' />
          </div>

          <div className='selected-image'>
            {getSelectedImagesCount()} selected
          </div>

          <div className='delete-me' onClick={handleDeleteSelectedImages}>
            <RiDeleteBin6Line size={25} color='white' className='delete' />
          </div>

          <div className='download-selected' onClick={handleDownloadSelectedImages}>
            <RiDownload2Fill size={25} color='white' className='download' />
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