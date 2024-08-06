import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Image } from '../types/Image.types';
import api from '../api';

interface ImageContextProps {
  images: Image[];
  savedImages: Image[];
  fetchSavedImages: () => Promise<void>;
  saveImageToSaved: (image_id: number) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  fetchImageById: (id: number) => Promise<Image | undefined>;
  fetchImages: (page: number, limit: number) => Promise<void>;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useImages = (): ImageContextProps => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [savedImages, setSavedImages] = useState<Image[]>([]);

  const fetchImages = useCallback(async (page: number, limit: number) => {
    try {
      const response = await api.get(`/images?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setImages(response.data);
    } catch (error) {
    //  console.error('Error fetching images:', error);
    }
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get('/images', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setImages(response.data);
      } catch (error) {
      //  console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  const fetchSavedImages = async () => {
    try {
      const response = await api.get('/saved-images', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSavedImages(response.data);
    } catch (error) {
    //  console.error('Error fetching saved images:', error);
    }
  };

  const saveImageToSaved = async (image_id: number) => {
    try {
      const response = await api.post('/saved-images', { image_id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.message !== 'Image already saved') {
        const image = images.find(img => img.id === image_id);
        if (image) {
          setSavedImages((prevSavedImages) => [...prevSavedImages, image]);
        }
      }
    } catch (error) {
    //  console.error('Error saving image to saved images:', error);
    }
  };

  const fetchImageById = async (id: number): Promise<Image | undefined> => {
    try {
      const response = await api.get(`/images/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
    //  console.error('Error fetching image by ID:', error);
    }
  };

  const deleteImage = async (id: number) => {
    try {
      const response = await api.delete(`/images/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        setImages((prevImages) => prevImages.filter((image) => image.id !== id));
        setSavedImages((prevSavedImages) => prevSavedImages.filter((image) => image.id !== id));
      } else {
      //  console.error('Failed to delete image');
      }
    } catch (error) {
    //  console.error('Error deleting image:', error);
    }
  };

  return (
    <ImageContext.Provider value={{ images, savedImages, fetchSavedImages, fetchImageById, saveImageToSaved, deleteImage, fetchImages }}>
      {children}
    </ImageContext.Provider>
  );
};