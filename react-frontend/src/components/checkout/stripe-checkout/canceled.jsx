import React from 'react';
import withRouter from '../../../withRouter';
import Layout from '../../shared/layout';
import { useNavigate } from "react-router-dom";

const Canceled = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className='checkout'>
        <h1>Payment failed</h1>
        <p>Payment was not successful</p>
        <div>
          <button className='button is-black nomad-btn submit' 
          onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(Canceled);