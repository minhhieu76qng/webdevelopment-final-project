import React from 'react';
import HeaderComp from '../header/Header';

const Layout = ({ children }) => {
  return (
    <>
      <HeaderComp />
      {children}
    </>
  );
};

export default Layout;
