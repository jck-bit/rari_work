import { memo } from 'react';
import Headroom from 'react-headroom';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Transition from './Transition';
import Button from './Button';



// eslint-disable-next-line react-refresh/only-export-components
function Header() {
  
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');
  const navigateToSavedImages = () => navigate('/saved-images')


return (
    <Headroom upTolerance={1}>
      <Transition
        className="Header"
        direction="down"
        distance={20}
      >
        <Button
          className="Logo"
           handleClick={navigateToHome}
        >
          <h4>Anatomie</h4>
        </Button>
        <SearchBar />
        <Button
          className="Cart"
          handleClick={navigateToSavedImages}
        >
         
          My Images
        </Button>        
      </Transition>
    </Headroom>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Header)