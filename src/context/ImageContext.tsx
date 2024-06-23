// src/ImageContext.js
import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Image } from '../types/Image.types';



interface ImageContextProps {
    images: Image[];
    deleteImage: (id: number) => void;
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
  
    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const loadPhotos = await fetch('https://rari-express.vercel.app/images');
          const response = await loadPhotos.json();
          console.log('Fetched photos:', response);
          setImages(response);
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };
  
      fetchPhotos();
    }, []);
  
    
  const deleteImage = async (id: number) => {
    try {
      const response = await fetch(`https://rari-express.vercel.app/images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.id !== id));
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
    return (
      <ImageContext.Provider value={{ images, deleteImage }}>
        {children}
      </ImageContext.Provider>
    );
  };