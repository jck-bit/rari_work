import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollTo } from 'framer-motion-scroll-to-hook';
import { RiArrowRightLine } from 'react-icons/ri';
import {
  Transition,
  Button,
  Loading,
} from '../../components';
import FlowCard from './Components/FlowCard';


interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const cardDuration = 10;
const cycleArray = (array: unknown[]) => {
  const newArray = [...array];
  newArray.push(newArray.shift());
  return newArray;
};
const getRandomItems = (items: unknown[], length: number) => {
  const randomItems = new Set();
  while (randomItems.size < length) {
    const index = Math.floor(Math.random() * items.length);
    randomItems.add(items[index]);
  }
  return [...randomItems];
};

function Home() {
  const [photos, setPhotos] = useState<Photo[]>();
  const scrollTo = useScrollTo();
  const navigate = useNavigate();
  const navigateToStore = () => navigate('/images');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const loadPhotos = await fetch('https://jsonplaceholder.typicode.com/photos/');
        const response = await loadPhotos.json();
        console.log(response);
        const photos = getRandomItems(response, 4) as Photo[];
        setPhotos(photos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval: NodeJS.Timer | number;
    if (photos) {
      interval = setInterval(() => {
        setPhotos(photos => cycleArray(photos as Photo[]) as Photo[]);
      }, cardDuration * 1000);
    }
    scrollTo();
    return () => clearInterval(interval as number);
  }, [photos, scrollTo]);

  return (
    <Transition className="Home" direction="left">
      {photos ? (
        <Transition className="Grid">
          {photos.map(({id, title, url}, i) =>(
            <FlowCard
            key={id}
            id={id}
            name={title}
            backgroundImage={url}
            duration={cardDuration}
            big={i === 0}
            />
          ))}
          <Button
            className="Store"
            handleClick={navigateToStore}
          >
            Go to the Menu <RiArrowRightLine />
          </Button>
        </Transition>
      ) : (
        <Loading />
      )}
    </Transition>
  );
}

export default Home;
