import { AnimatePresence, motion } from 'framer-motion';
import { enablePageScroll } from 'scroll-lock';
import { RiArrowRightLine } from 'react-icons/ri';
import { Image } from '../types/Image.types';
import Transition from './Transition';
import CartItem from './CartItem';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
interface Props {
  cartItems: Image[],
  setIsCartOpen: (isCartOpen: boolean) => void,
  removeFromCart: (ids: number[]) => void,
}

function Cart(props: Props) {
  const navigate = useNavigate();

  const handleCheckout = async () => {
    
    // #navigate to the payment page 
    if(props.cartItems.length > 0){
      navigate('/payment');
    }
  };


  const {
    cartItems,
    setIsCartOpen,
    removeFromCart,
  } = props;
  const clearCart = () => {
    removeFromCart(cartItems.map(item => item.id));
  };
  const closeCart = () => {
    setIsCartOpen(false);
    enablePageScroll();
  };
  let gamesCount;
  if (cartItems.length > 1) {
    gamesCount = `${cartItems.length} Images`;
  } else if (cartItems.length === 1) {
    gamesCount = '1 Image';
  } else {
    gamesCount = 'No Images saved';
  }
//   const totalPrice = cartItems
//     .reduce((acc, item) => acc + item.price, 0)
//     .toFixed(2);

  return (
    <>
      <Transition className="Background">
        <div onClick={closeCart} />
      </Transition>
      <motion.div
        className="CartModal"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0, x: '100%',
          transition: { duration: 0.25 },
        }}
        transition={{
          type: 'spring',
          duration: 0.5,
        }}
      >
        <div className="CartHeader">
          <h3>{gamesCount}</h3>
          {cartItems.length > 0 && (
            <Button handleClick={clearCart}>Clear</Button>
          )}
        </div>
        <div className="Items">
          <AnimatePresence>
            {cartItems.map((game) => (
              <CartItem
                key={`cart-${game.id}`}
                image={game}
                closeCart={closeCart}
                removeFromCart={removeFromCart} />
            ))}
            
          </AnimatePresence>
          
        </div>
        <div className="Checkout">
          <Button handleClick={handleCheckout}>Download Images <RiArrowRightLine /></Button>
        </div>
      </motion.div>
    </>
  );
}

export default Cart;
