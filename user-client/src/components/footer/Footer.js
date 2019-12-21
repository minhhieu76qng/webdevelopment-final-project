import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/imgs/logo.png';

const Footer = ({ categories }) => {
  return (
    <footer className='footer mt-5'>
      <Container>
        <Row>
          <Col xs={12} md={3}>
            <Link to='/'>
              <img className='logo' src={logo} alt='Logo' />
            </Link>
          </Col>
          <Col xs={12} md={5} className='mt-2 mt-md-0'>
            {categories && (
              <ul>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <NavLink to={`/categories/${cat._id}`}>{cat.name}</NavLink>
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col xs={12} md={4} className='mt-2 mt-md-0'>
            <p>Phone: 0123456789</p>
            <p>Address: 123 ABC, Dictrict 5, Ho Chi Minh City, Vietnam</p>
            <p>
              Email:
              {' '}
              <a href='mailto:minhhieu76qng@gmail.com'>
                minhhieu76qng@gmail.com
              </a>
            </p>
          </Col>
        </Row>
      </Container>
      <div
        style={{ fontSize: 14 }}
        className='text-center py-2 border-top border-light'
      >
        <Container>
          Copyright &copy; 2019 Uber for Tutor. All right reserved.
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
