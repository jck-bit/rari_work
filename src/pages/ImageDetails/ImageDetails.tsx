import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading, Transition } from '../../components';
import { Container } from 'react-bootstrap';
import Info from './components/Info';
import { Image } from '../../types/Image.types';
import NavBar from '../../components/Navbar';
import Carousel from './components/Carousel';
import { useImages } from '../../context/ImageContext';

const ImageDetails: React.FC = () => {
  const { ImageId } = useParams<{ ImageId: string }>();
  const id = Number(ImageId);
  const { fetchImageById } = useImages();
  const [image, setImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (id) {
        const fetchedImage = await fetchImageById(id);
        if (fetchedImage) {
          setImage(fetchedImage);
        }
      }
    };

    fetchImage();
  }, [id, fetchImageById]);

  return (
    <Container>
      <Transition className="GameDetails" direction="left">
        <NavBar showStoreButton title={''} />
        {image ? (
          <Transition className="Grid">
            <Carousel duration={0}>
              <div key={`img-${image.id}`} className='Image'>
                <img src={image.image_url} alt='' className='BackgroundImage' />
              </div>
            </Carousel>
            <Info image={image} />
          </Transition>
        ) : (
          <Loading />
        )}
      </Transition>
    </Container>
  );
}

export default ImageDetails;
