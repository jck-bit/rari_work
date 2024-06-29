import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import { Transition, Button, Loading } from '../../components';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      if (!email || !password) {
        alert('Please enter all required fields.');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      navigate('/images');
    } catch (error) {
      console.error('Login error', error);
      setIsLoading(false);
    }
  };

  return (
    
    <Transition className="Login">
      {!isLoading ? (
        <Transition className="login-wrapper">
          <div className="left">
            <h1 className='Anatomie'>Anatomie</h1>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Button className="Store" handleClick={handleLogin}>
                Login <RiArrowRightLine />
              </Button>
            </div>
          </div>
        </Transition>
      ) : (
        <Loading />
      )}
    </Transition>
  );
};

export default Login;


