import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading, Transition } from '../../components';
import { Container, Row, Col } from 'react-bootstrap'; // Import Row and Col from react-bootstrap
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
          <Transition>
            <Row className="align-items-center">
              <Col md={6} className="mb-4 mb-md-0">
                <Carousel duration={0}>
                  <div key={`img-${image.id}`} className="Image">
                    <img src={image.image_url} alt="" className="img-fluid" />
                  </div>
                </Carousel>
              </Col>
              <Col md={6}>
                <Info image={image} />
              </Col>
            </Row>
          </Transition>
        ) : (
          <Loading />
        )}
      </Transition>
    </Container>
  );
};

export default ImageDetails;
