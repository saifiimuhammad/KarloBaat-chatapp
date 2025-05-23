

import React from 'react';
import { Helmet } from 'react-helmet-async';

const Title = ({ title='KarloBaat', description='This is chat app called KarloBaat' }) => {

return (
  <Helmet>
    <title>{title}</title>
    <meta name='description' content={description}/>
  </Helmet>
);
}

export default Title;
