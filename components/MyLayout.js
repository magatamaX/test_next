import Header from './Header'

import React from 'react';
import ReactDOM from 'react-dom';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
  clear: 'both'
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
  </div>
)

export default Layout
