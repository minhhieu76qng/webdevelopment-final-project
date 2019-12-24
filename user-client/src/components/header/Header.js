import React from 'react';
import { Navbar, Nav, Image, Dropdown, Container } from 'react-bootstrap';
import { Link, useHistory, NavLink } from 'react-router-dom';
import _ from 'lodash';
import logo from '../../assets/imgs/logo.png';
import '../../assets/scss/Header.scss';
import TokenStorage from '../../utils/TokenStorage';
import avatarImg from '../../assets/imgs/avatar.jpg';
import CustomToggle from '../widgets/DropdownToggle';
import ROLE from '../../constance/Role';

const HeaderComp = ({ account, categories, logOut }) => {
  const history = useHistory();
  let avatar = avatarImg;
  if (account && account.avatar) {
    avatar = account.avatar;
  }

  const onLogOut = () => {
    TokenStorage.remove();
    logOut();
    history.push('/');
  };

  return (
    <header
      className='header shadow sticky-top'
      style={{ backgroundColor: '#fff' }}
    >
      <div id='top-header' style={{ borderBottom: '1px solid #ccc' }}>
        <Container>
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
              {!account && (
                <>
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
                </>
              )}

              {/* {(!account || (account && account.role === ROLE.student)) && (
                <Nav.Item className='nav-item'>
                  <Link to='/new-job' className='button-link link'>
                    Post a job
                  </Link>
                </Nav.Item>
              )} */}
              {account && (
                <Nav.Item>
                  <Dropdown drop='down' className='custom-dropdown-menu'>
                    <Dropdown.Toggle as={CustomToggle}>
                      <Image
                        className='avatar'
                        src={avatar}
                        roundedCircle
                        alt='User'
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      alignRight
                      className='shadow-lg rounded mt-2'
                    >
                      <Dropdown.Item as='div'>
                        <Link to='/account'>Account</Link>
                      </Dropdown.Item>
                      <Dropdown.Item as='div'>
                        <button
                          type='button'
                          className='d-block w-100 text-left reset-button'
                          onClick={onLogOut}
                        >
                          Log Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>
              )}
            </Nav>
          </Navbar>
        </Container>
      </div>

      {(!account || (account && account.role === ROLE.student)) && (
        <div>
          <Container>
            <Navbar expand='md'>
              <Navbar.Toggle
                aria-controls='basic-navbar-nav'
                className='btn-sm'
                style={{ fontSize: 14 }}
              />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='main-navbar'>
                  {categories &&
                    _.isArray(categories) &&
                    categories.map(cat => (
                      <Nav.Link
                        key={cat._id}
                        className='mr-md-4'
                        as={NavLink}
                        to={`/categories/${cat._id}`}
                      >
                        {cat.name}
                      </Nav.Link>
                    ))}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Container>
        </div>
      )}
    </header>
  );
};

export default HeaderComp;
