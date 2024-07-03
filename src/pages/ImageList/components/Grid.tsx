import React, { memo } from 'react';
import { Transition } from '../../../components';
import GameCard from './ImageCard';
import { Image } from '../../../types/Image.types';

interface Props {
  images: Image[],
  columnsCount: number,
  handleDeleteImage: (id: number) => void;
  handleSaveImage: (id: number) => void; // Add handleSaveImage prop
}

// eslint-disable-next-line react-refresh/only-export-components
const Grid: React.FC<Props> = ({ images, columnsCount, handleDeleteImage, handleSaveImage }) => {
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
              <GameCard
                key={image.id}
                image={image}
                handleDeleteImage={handleDeleteImage}
                handleSaveImage={handleSaveImage} // Pass handleSaveImage to GameCard
              />
            ))}
          </div>
        ))}
      </>
    </Transition>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Grid);
