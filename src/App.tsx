
import './scss/App.scss';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components';
import { NotFound } from './pages';
import ImageList from './pages/ImageList/ImageList';
import ImageDetails from './pages/ImageDetails/ImageDetails';
import Login from './pages/Login/Login';
import ProtectedRoute from './Protected';
import { AuthProvider } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext';
import SavedImages from './pages/SavedImages/SavedImages';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <ImageProvider>
        <div className='App'>
          {isAuthenticated() && (
             <Header />
          )}
              
          <Routes location={location} key={location.pathname}>
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Navigate to="/images" replace />} />
            <Route path="*" element={<NotFound />} />
            <Route 
              path="/images" 
              element={
                <ProtectedRoute>
                  <ImageList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/images/:ImageId" 
              element={
                <ProtectedRoute>
                  <ImageDetails />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/saved-images" 
              element={
                <ProtectedRoute>
                  <SavedImages />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </ImageProvider>
    </AuthProvider>
  );
};

export default App;
