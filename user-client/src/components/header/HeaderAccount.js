import React from 'react';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/imgs/logo.png';
import '../../assets/scss/Header.scss';
import TokenStorage from '../../utils/TokenStorage';
import avatarImg from '../../assets/imgs/avatar.jpg';
import CustomToggle from '../widgets/DropdownToggle';

const HeaderAccount = ({ account, logOut }) => {
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
    <header className='header' style={{ backgroundColor: '#fff' }}>
      {/* <div style={{ borderBottom: '1px solid #ccc' }}> */}
      <div>
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
                <Dropdown.Menu alignRight className='shadow-lg rounded mt-2'>
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
          </Nav>
        </Navbar>
      </div>
    </header>
  );
};

export default HeaderAccount;
