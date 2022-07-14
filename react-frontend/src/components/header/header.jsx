import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../walletconnect/walletconnect';
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
            Books
          </Link>
        </li>
      </ul>
      <WalletConnect />
    </nav>
  );
}

export default Header;
