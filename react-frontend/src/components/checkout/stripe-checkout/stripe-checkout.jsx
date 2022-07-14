import React, { useState } from 'react';

const StripeCheckout = () => {
  const [email, setEmail] = useState('');
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
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