import React, { useContext, useState } from 'react';
import { CartContext } from '../../../context/cart-context';

const StripeCheckout = () => {
  const [email, setEmail] = useState('');
  const { cartItems } = useContext(CartContext);
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    // const line_items = cartItems.map(item => {
    //   return {
    //     quantity: item.quantity,
    //     price_data: {
    //       currency: 'usd',
    //       unit_amount: item.price * 100, // amount is in cents
    //       product_data: {
    //         name: item.title,
    //         description: item.description,
    //         images: [item.imageUrl], 
    //       }
    //     }
    //   }
    // });
  }

  return (
    <form onSubmit={handleGuestCheckout}>
      <div>
        <input 
          type='email'
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          value={email}
          className='nomad-input'
        />
      </div>
      <div className='submit-btn'>
        <button type='submit' className='button is-black nomad-btn submit'>
          Checkout
        </button>
      </div>
    </form>
  );
}

export default StripeCheckout;