import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Loading, Transition } from '../../components';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import Info from './components/Info';
import { Image } from '../../types/Image.types';
import NavBar from '../../components/Navbar';
import { RiAddLine, RiCheckLine } from 'react-icons/ri';
import Carousel from './components/Carousel';

interface Props {
  cartItems: Image[];
  addToCart: (image: Image) => void;
}

function ImageDetails({ cartItems, addToCart }: Props) {
  const { ImageId } = useParams();
  const id = Number(ImageId);
  const [image, setImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`);
        const data = await response.json();
        setImage(data);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [id]);

  return (
    <Transition className="ImageDetails" direction="left">
      <NavBar showStoreButton title={image?.title} />
      {image

        ? <Transition className="Grid">
            <Carousel  duration={0}>
            <div
               key={`img-${image.id}`}
               className='Image'
            >
                <img src={image.thumbnailUrl}/>
            </div>
           </Carousel>
          <Info image={image} />
          <div className="Price">
            ${image.id}
            {cartItems.find((item) => item.id === id)
              ? <Transition className="Added">
                Added <RiCheckLine />
              </Transition>
              : <Button handleClick={() => addToCart(image)}>
                Add to cart <RiAddLine />
              </Button>
            }
          </div>
        </Transition>
        
        : <Loading />
      }
    </Transition>
  );
}

export default ImageDetails;
