import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/imgs/logo.png';
import '../../assets/scss/Header.scss';

const HeaderComp = () => {
  return (
    <div className='header'>
      <Navbar
        style={{
          backgroundColor: '#fff',
          paddingTop: '15px',
          paddingBottom: '15px',
        }}
        sticky='top'
      >
        <Link to='/'>
          <Navbar.Brand>
            <img
              src={logo}
              className='d-inline-block align-top logo-page'
              alt='Uber for Tutor'
            />
          </Navbar.Brand>
        </Link>
        <Nav className='ml-auto'>
          <Nav.Item className='nav-item'>
            <Link className='link' to='/login'>
              Log In
            </Link>
          </Nav.Item>
          <Nav.Item className='nav-item'>
            <Link className='link' to='/sign-up'>
              Sign up
            </Link>
          </Nav.Item>
          <Nav.Item className='nav-item'>
            <Link to='/new-job' className='button-link link'>
              Post a job
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
};

export default HeaderComp;
