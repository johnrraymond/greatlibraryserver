import React, { useState } from 'react';
import withRouter from '../../../withRouter';

const CustomCheckout = () => {
  const [processing, setProcessing] = useState(false);
  const [error, ] = useState(null);
  const [payment, setPaymentCard] = useState('');
  const [saveCard, setSavedCard] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);

  }

  const savedCardCheckout = async () => {
    setProcessing(true);
  }

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