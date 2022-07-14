import React from 'react';
import Layout from './shared/layout';
import Hero from './hero/hero';
import MainSection from './main-section/main-section';
import FeaturedCollection from './featured-collection/featured-collection';

const HomePage = () => {
  console.log('this is the error')
  return (
    <>
      <Layout>
        <Hero />
        <MainSection />
        <FeaturedCollection />
      </Layout>
    </>
  );
}

export default HomePage;