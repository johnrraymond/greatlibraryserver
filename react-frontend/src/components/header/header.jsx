import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '../cart-icon/cart-icon';
import './header.styles.scss';

const Header = () => {
  return (
    <nav className='nav-menu container'>
      <div className='logo'>
        <Link to='/'>The Great Library</Link>
      </div>
      <ul>
        <li>
          <Link to='/'>
            Home
          </Link>
        </li>
        <li>
          <Link to='/shop'>
            Shop
          </Link>
        </li>
        {
          <li>
            <Link to='/sign-in'>
              Sign In
            </Link>
          </li>
        }
        {
          <li onClick={()=> {}}>
            Sign Out
          </li>
        } 
        {
          <li>
            <Link to='/sign-up'>
              Sign Up
            </Link>
          </li>
        }
      </ul>
      <CartIcon />
    </nav>
  );
}

export default Header;
