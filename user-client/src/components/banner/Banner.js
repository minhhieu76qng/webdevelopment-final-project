import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import b1 from '../../assets/imgs/b1.jpg';
import b2 from '../../assets/imgs/b2.jpg';
import b3 from '../../assets/imgs/b3.jpg';

const Banner = () => {
  return (
    <Carousel fade interval={2000} className='banner'>
      <Carousel.Item className='carousel-item'>
        <img className='d-block w-100' src={b1} alt='First slide' />
        <Carousel.Caption className='text-left'>
          <p className='banner-title'>
            Hire expert freelancers for any job, online
          </p>
          <p className='banner-subtitle'>
            Millions of small businesses use Freelancer to turn their ideas into
            reality.
          </p>
          <Link to='/sign-up' className='button-link link'>
            Join now
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='carousel-item'>
        <img className='d-block w-100' src={b2} alt='Third slide' />

        <Carousel.Caption className='text-left'>
          <p className='banner-title'>
            Hire expert freelancers for any job, online
          </p>
          <p className='banner-subtitle'>
            Millions of small businesses use Freelancer to turn their ideas into
            reality.
          </p>
          <Link to='/sign-up' className='button-link link'>
            Join now
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='carousel-item'>
        <img className='d-block w-100' src={b3} alt='Third slide' />

        <Carousel.Caption className='text-left'>
          <p className='banner-title'>
            Hire expert freelancers for any job, online
          </p>
          <p className='banner-subtitle'>
            Millions of small businesses use Freelancer to turn their ideas into
            reality.
          </p>
          <Link to='/sign-up' className='button-link link'>
            Join now
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Banner;
