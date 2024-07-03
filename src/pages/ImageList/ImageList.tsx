import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams} from 'react-router-dom';
import { useIsPresent } from 'framer-motion';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { useWindowWidth } from '@react-hook/window-size';
import { Transition, Loading } from '../../components';
import Grid from './components/Grid';
import NavBar from '../../components/Navbar';
import { useImages } from '../../context/ImageContext';

const minCardWidth = 330;
let scrollY = 0;

function ImageList() {
  const { images, deleteImage, saveImageToSaved, setImages } = useImages();
  const [columnsCount, setColumnsCount] = useState(1);
  const windowWidth = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const scrollTo = useScrollTo();
  const isPresent = useIsPresent();
  

  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialLimit = parseInt(searchParams.get('limit') || '20', 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [imagesPerPage, setImagesPerPage] = useState(initialLimit);

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
      window.scrollTo(0, scrollY);
    },
    [deleteImage]
  );

  const handleSaveImage = useCallback(
    async (id: number) => {
      scrollY = window.scrollY;
      await saveImageToSaved(id);
      window.scrollTo(0, scrollY);
    },
    [saveImageToSaved]
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

  useEffect(() => {
    window.scrollTo(0, scrollY);
  }, [images]);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/images?page=${currentPage}&limit=${imagesPerPage}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [currentPage, imagesPerPage, setImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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

  return (
    <Transition className="GameList" direction="right">
      <NavBar
        showStoreButton={!!location.search}
        title={searchParams.get('search') || ''}
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
      {images
        ? images.length
          ? <Grid
              images={images}
              columnsCount={columnsCount}
              handleDeleteImage={handleDeleteImage}
              handleSaveImage={handleSaveImage}
            />
          : <Transition className="NoGames">No Images found.</Transition>
        : <Loading />
      }
    </Transition>
  );
}

export default ImageList;
