import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../../withRouter';
import { ProductsContext } from '../../context/products-context';
import { CartContext } from '../../context/cart-context';
import Layout from '../shared/layout';
import { useNavigate } from "react-router-dom";
import './single-product.styles.scss';

const SingleProduct = ({ match }) => {
  const navigate = useNavigate();
  const { products } = useContext(ProductsContext);
  const { addProduct, increase } = useContext(CartContext);
  const { id } = match.params;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const product = products.find(item => Number(item.id) === Number(id));

    // if product does not exist, redirec to shop page
    if (!product) {
      return navigate('/shop');
    }

    setProduct(product);
  }, [id, product, navigate, products]);
  // while we check for product
  if (!product) { return null }
  const { imageUrl, author, title, price, description } = product;
  return (
    <Layout>
      <div className='single-product-container'>
        <div className='product-image'>
          {/* <img src={imageUrl} alt='product' /> */}
          <img src='assets/img/template_1.jpg' alt='product' />
        </div>
        <div className='product-details'>
          <div className='name-price'>
            <h3>{title}</h3>
            <strong><i>{author}</i></strong> 
            <h5>{description}</h5>
            <p><i>${price}</i></p>
          </div>

          <div className='add-to-cart-btns'>
            {
              <button 
                className='button is-white nomad-btn' 
                id='btn-white-outline'
                onClick={() => addProduct(product)}>
                  ADD TO CART
              </button> 
            }
            {
              <button 
                className='button is-white nomad-btn' 
                id='btn-white-outline'
                onClick={()=> increase(product)}>
                  ADD MORE
              </button>
            }
            <Link to='/checkout'>
            <button className='button is-black nomad-btn' id='btn-white-outline'>
              PROCEED TO CHECKOUT
            </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(SingleProduct);