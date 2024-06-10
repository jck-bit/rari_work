import './scss/App.scss'
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components'
import { Home, NotFound } from './pages';
import ImageList from './pages/ImageList/ImageList';
import { useCallback, useState } from 'react';
import { Image } from './types/Image.types';
import ImageDetails from './pages/ImageDetails/ImageDetails';
import { AnimatePresence } from 'framer-motion';
import Cart from './components/Cart';

function App() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState<Image[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((image: Image) => {
    setCartItems([...cartItems, image]);
  }, [cartItems]);
  const removeFromCart = useCallback((ids: number[]) => {
    setCartItems(cartItems.filter((item) => !ids.includes(item.id)));
  }, [cartItems]);
  return (
    <div className='App'>
    <Header  cartItems={cartItems} setIsCartOpen={setIsCartOpen}/>
    <AnimatePresence exitBeforeEnter>
        {isCartOpen && (
          <Cart
            cartItems={cartItems}
            setIsCartOpen={setIsCartOpen}
            removeFromCart={removeFromCart}
          />
        )}
      </AnimatePresence>

    <Routes location={location} key={location.pathname}>
      <Route path='*' element={<NotFound/>}/>

      <Route path='/' element ={<Home />}/>

      <Route path="images">
            <Route
              index
              element={
                <ImageList
                  
                  cartItems={cartItems}
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path=":ImageId"
              element={
                <ImageDetails
                  cartItems={cartItems}
                  addToCart={addToCart}
                />
              }
            />
            
          </Route>
        
    </Routes>
    </div>
  )
}

export default App