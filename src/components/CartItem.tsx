import { useNavigate } from 'react-router-dom';
import { RiCloseLine } from 'react-icons/ri';
import Transition from './Transition';
import Button from './Button';
import { Image } from '../types/Image.types';

interface Props {
  image: Image,
  closeCart: () => void,
  removeFromCart: (ids: number[]) => void,
}

function CartItem(props: Props) {
  const { image, closeCart, removeFromCart } = props;
  const { id, name } = image;
  const navigate = useNavigate();
  const navigateToGame = () => {
    navigate(`/images/${id}`);
    closeCart();
  };
  const removeItem = () => removeFromCart([id]);

  return (
    <Transition
      key={`cart-${id}`}
      layout
      className="Item"
      direction="right"
      durationOut={0.15}
    >
      <Button handleClick={navigateToGame}>
        {name}
      </Button>
      {/* ${price} */}
      <Button
        className="Remove"
        title="Remove"
        handleClick={removeItem}
      >
        <RiCloseLine />
      </Button>
    </Transition>
  );
}

export default CartItem;

