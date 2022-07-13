import React, { useState, useEffect, useContext } from 'react';
import withRouter from '../../../withRouter';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';

const CustomCheckout = ({ shipping, cartItems, history: { push } }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [payment, setPaymentCard] = useState('');
  const [saveCard, setSavedCard] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);

  }

  const savedCardCheckout = async () => {
    setProcessing(true);
  }

  const cardHandleChange = event => {
    const { error } = event;
    setError(error ? error.message: '');
  }

  const cardStyle = {
    style: {
      base: {
        color: "#000",
        fontFamily: 'Roboto, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#606060",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  let cardOption;

  return (
    <div>
      {
        <div>
          <div className="select-drop-down">
            <select value={payment} onChange={e => setPaymentCard(e.target.value)}>
              { cardOption }
            </select>
          </div>
          <button
            type='submit'
            disabled={processing || !payment}
            className='button is-black nomad-btn submit saved-card-btn'
            onClick={() => savedCardCheckout()}
          >
          { processing ? 'PROCESSING' : 'PAY WITH SAVED CARD' }
          </button>
        </div>
      }
      <h4>Or Enter Your Payment Info Below</h4>
      <div className='stripe-card'>
        <CardNumberElement 
          className='card-element'
          options={cardStyle}
          onChange={cardHandleChange}
        />
      </div>
      <div className='stripe-card'>
        <CardExpiryElement 
          className='card-element'
          options={cardStyle}
          onChange={cardHandleChange}
        />
      </div>
      <div className='stripe-card'>
        <CardCvcElement 
          className='card-element'
          options={cardStyle}
          onChange={cardHandleChange}
        />
      </div>
      {
        <div className='save-card'>
          <label>Save Card </label>
          <input 
            type='checkbox'
            checked={saveCard}
            onChange={e => setSavedCard(e.target.checked)}
          />
        </div>
      }
      <div className='submit-btn'>
        <button
          disabled={processing}
          className='button is-black nomad-btn submit'
          onClick={() => handleCheckout()}
        >
          { processing ? 'PROCESSING' : 'PAY' }
        </button>
      </div>
      {
        error && (<p className='error-message'>{error}</p>)
      }
    </div>
  );
}

export default withRouter(CustomCheckout);