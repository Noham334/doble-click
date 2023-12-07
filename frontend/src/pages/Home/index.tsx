import MainImage from '../../assets/images/main-image.webp';
import ButtonIcon from 'components/ButtonIcon';
import { Link } from 'react-router-dom';

import './styles.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="base-card home-card">
        <div className="home-content-container">
          <div>
            <h1>Acceda al catálogo de nuestros productos</h1>
            <p>
              Te ayudaremos a encontrar lo mejor en hardware, accesórios y
              portátiles!
            </p>
          </div>
          <div>
            <Link to="/products">
              <ButtonIcon text="INICIAR BUSQUEDA AHORA" />
            </Link>
          </div>
        </div>
        <div className="home-image-container d-flex align-items-center justify-content-center ">
          <img className="main-image" src={MainImage} alt="gamer" />
        </div>
      </div>
    </div>
  );
};

export default Home;
