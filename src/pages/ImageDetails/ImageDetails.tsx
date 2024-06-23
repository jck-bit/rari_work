import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Loading, Transition } from '../../components';
import { BackgroundImage } from 'react-image-and-background-image-fade';
import Info from './components/Info';
import { Image } from '../../types/Image.types';
import NavBar from '../../components/Navbar';
import { RiAddLine, RiCheckLine, RiDeleteBin2Fill } from 'react-icons/ri';
import Carousel from './components/Carousel';

interface Props {
  cartItems: Image[];
  addToCart: (image: Image) => void;
}

function ImageDetails({ cartItems, addToCart }: Props) {
  const { ImageId } = useParams<{ ImageId: string }>();
  const id = Number(ImageId);
  const [image, setImage] = useState<Image | undefined>();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://rari-express.vercel.app/images/${id}`);
        if (!response.ok) {
          throw new Error('Image not found');
        }
        const data = await response.json();
        setImage(data);
        console.log('Fetched image:', data);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [id]);
  

  return (
    <Transition className="GameDetails" direction="left">
      <NavBar showStoreButton title={''} />
      {image ? (
        <Transition className="Grid">
          <Carousel duration={0}>
            <div key={`img-${image.id}`} className='Image'>
              <img src={image.image_url} className='BackgroundImage'/>
            </div>
          </Carousel>
          <Info image={image} />
          <div className="Price">
            {cartItems.find((item) => item.id === id) ? (
              <Transition className="Added">
                Added <RiCheckLine />
              </Transition>
            ) : (
              <Button handleClick={() => addToCart(image)} className="SaveButton">
                Save Image <RiAddLine />
              </Button>
            )}
            <div className='DeleteButton'>
              <Button type="delete" className='DeleteButton'>
                Delete Image <RiDeleteBin2Fill/>
              </Button>
            </div>
          </div>
        </Transition>
      ) : (
        <Loading />
      )}
    </Transition>
  );
}

export default ImageDetails;
