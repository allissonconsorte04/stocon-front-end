import { nav } from '../../routes/navigation';
import Logo from '../../assets/logo_restaurante.png';
import './navbar.css';
import { Link } from 'react-router-dom';
import { AuthData } from '../../routes/AuthWrapper';

function Navbar() {
  const { user, logout } = AuthData();

  const MenuItem = ({ r }) => {
    return (
      <Link to={r.path} className="navbar-item">
        {r.name}
      </Link>
    );
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item">
          <img
            src={Logo}
            width="60"
            height="50"
            alt="Bulma Logo"
            style={{ maxHeight: 100 }}
          />
        </a>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-route-items">
            {nav.map((r, i) => {
              if (!r.isPrivate && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else if (user.isAuthenticated && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else return false;
            })}
          </div>

          {user.isAuthenticated ? (
            <div className="navbar-item">
              <Link to={'#'} onClick={logout} className="btn is-primary">
                Log out
              </Link>
            </div>
          ) : (
            <div className="navbar-item">
              <Link to={'login'} className="btn is-primary">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
