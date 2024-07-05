import React from 'react';
import { Transition } from '../../../components';
import ImageCard from './ImageCard';
import { Image } from '../../../types/Image.types';

interface Props {
  images: Image[],
  columnsCount: number,
  handleDeleteImage: (id: number) => void,
  handleSaveImage: (id: number) => void,
  handleSelectImage: (id: number) => void,
  selectedImages: number[],
  selectionMode: boolean,
  handleLongPress: () => void,
  isSavedPage?: boolean; 
}

// eslint-disable-next-line react-refresh/only-export-components
const Grid: React.FC<Props> = ({
  images,
  columnsCount,
  handleDeleteImage,
  handleSaveImage,
  handleSelectImage,
  selectedImages,
  selectionMode,
  handleLongPress,
  isSavedPage = false, // Default value is false
}) => {
  const imagesPerColumn = Math.ceil(images.length / columnsCount);
  const columns = Array(columnsCount).fill(null).map((_, index) => {
    const imagesToDisplay = [];
    for (let i = 0; i < imagesPerColumn; i++) {
      const imageIndex = i * columnsCount + index;
      if (imageIndex < images.length) {
        imagesToDisplay.push(images[imageIndex]);
      }
    }
    return imagesToDisplay;
  });

  return (
    <Transition className="Grid">
      <>
        {columns.map((column, index) => (
          <div key={`column-${index}`} className="Column">
            {column.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                handleDeleteImage={handleDeleteImage}
                handleSaveImage={handleSaveImage}
                handleSelectImage={handleSelectImage}
                isSelected={selectedImages.includes(image.id)}
                selectionMode={selectionMode}
                handleLongPress={handleLongPress}
                isSavedPage={isSavedPage} // Pass the isSavedPage prop
              />
            ))}
          </div>
        ))}
      </>
    </Transition>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(Grid);
