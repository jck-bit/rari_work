import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from './components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';
import { RiCheckLine, RiDeleteBin6Line  } from 'react-icons/ri'; 
import { MdCancel  } from "react-icons/md";

const minCardWidth = 330;
let scrollY = 0;

function ImageList() {
  const { images, deleteImage, saveImageToSaved, fetchImages } = useImages();
  const [columnsCount, setColumnsCount] = useState(1);
  const windowWidth = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isPresent = useIsPresent();

  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialLimit = parseInt(searchParams.get('limit') || '20', 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [imagesPerPage, setImagesPerPage] = useState(initialLimit);

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
    fetchImages(currentPage, imagesPerPage);
  }, [currentPage, imagesPerPage, fetchImages]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      setSearchParams({ page: nextPage.toString(), limit: imagesPerPage.toString() });
      return nextPage;
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevpage) => {
      const prevPage = Math.max(prevpage - 1, 1);
      setSearchParams({ page: prevPage.toString(), limit: imagesPerPage.toString() });
      return prevPage;
    });
  };

  const handleImagesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value, 10);
    setImagesPerPage(limit);
    setSearchParams({ page: currentPage.toString(), limit: limit.toString() });
  };

  const handleDeleteImage = useCallback(async (id: number) => {
    scrollY = window.scrollY;
    await deleteImage(id);
    window.scrollTo(0, scrollY);
  }, [deleteImage]);

  const handleSaveImage = useCallback(async (id: number) => {
    scrollY = window.scrollY;
    await saveImageToSaved(id);
    window.scrollTo(0, scrollY);
  }, [saveImageToSaved]);

  const handleDeleteSelectedImages = useCallback(async () => {
    scrollY = window.scrollY;
    await Promise.all(selectedImages.map(id => deleteImage(id)));
    setSelectedImages([]);
    setSelectionMode(false);
    window.scrollTo(0, scrollY);
  }, [selectedImages, deleteImage]);

  const getSelectedImagesCount  = () => selectedImages.length;

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

          <div className='save-image' onClick={handleSaveSelectedImages}>
             <RiCheckLine size={25} color='white' className='tick'/>
          </div>

          <div className='delete-me' onClick={handleDeleteSelectedImages}>
            <RiDeleteBin6Line size={25} color='white' className='delete'/>
          </div>
        </div>
      )}
      {images
        ? images.length
          ? <>
              <Grid
                images={images}
                columnsCount={columnsCount}
                handleDeleteImage={handleDeleteImage}
                handleSaveImage={handleSaveImage}
                handleSelectImage={handleSelectImage}
                selectedImages={selectedImages}
                selectionMode={selectionMode}
                handleLongPress={handleLongPress}
              />
              <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage}>Next</button>
                <select value={imagesPerPage} onChange={handleImagesPerPageChange}>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </>
          : <Transition className="NoGames">No Images found.</Transition>
        : <Loading />
      }
    </Transition>
  );
}

export default ImageList;