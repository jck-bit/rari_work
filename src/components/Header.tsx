import { memo } from 'react';
import Headroom from 'react-headroom';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Transition from './Transition';
import Button from './Button';
import { Image } from '../types/Image.types';

import {
  addScrollableSelector,
  disablePageScroll,
} from 'scroll-lock';

import {
  RiShoppingBag2Line,
} from 'react-icons/ri';

interface Props {
  cartItems: Image[],
  setIsCartOpen: (isCartOpen: boolean) => void,
}

function Header(props: Props) {
  const { cartItems, setIsCartOpen } = props;
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');
  const openCart = () => {
    setIsCartOpen(true);
    addScrollableSelector('.Items');
    disablePageScroll();
  };

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
          <h4>Home</h4>
        </Button>
        <SearchBar />
        <Button
          className="Cart"
          handleClick={openCart}
        >
          <RiShoppingBag2Line />
          Images
          <div>{cartItems.length}</div>
        </Button>
      </Transition>
    </Headroom>
  );
}

export default memo(Header)