import { memo } from 'react';
import { Transition } from '../../../components';
import GameCard from './GameCard';
import { Image } from '../../../types/Image.types';

interface Props {
  images: Image[],
  cartItems: Image[];
  addToCart: (image: Image) => void;
  columnsCount: number;
}

// eslint-disable-next-line react-refresh/only-export-components
function Grid({ images, cartItems, addToCart, columnsCount }: Props) {
  const imagesPerColumn = Math.ceil(images.length / columnsCount);
  const columns = Array(columnsCount).fill(null).map((_, index) => {
    const imagesToDisplay = [];
    for (let i = 0; i < imagesPerColumn; i++) {
      const imageIndex = i * columnsCount + index;
      if (imageIndex < images.length) {
        console.log(images.length)
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
                cartItems={cartItems}
                addToCart={addToCart}
              />
            ))}
          </div>
        ))}
      </>
    </Transition>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Grid);
