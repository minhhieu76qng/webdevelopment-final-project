import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { toast } from '../components/widgets/toast';
import Banner from '../components/banner/Banner';
import TeacherCard from '../components/card/TeacherCard';

const SkeletonArr = new Array(4).fill(0);

const settings = {
  dots: true,
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Home = () => {
  const [impressedTeachers, setImpressedTeachers] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  // lay 10 giao vien co completedRate cao nhat
  useEffect(() => {
    setIsFetching(true);
    Axios.get('/api/user/teachers/impressed')
      .then(({ data: { teachers } }) => {
        setImpressedTeachers(teachers);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#fff' }} className='shadow-lg rounded'>
      <Banner />

      <div className='presentative-teachers mt-4'>
        <Slider {...settings} className='slick-teachers'>
          {isFetching &&
            SkeletonArr.map(() => (
              <div className='slick-item'>
                <TeacherCard loading />
              </div>
            ))}
          {!isFetching &&
            impressedTeachers &&
            _.isArray(impressedTeachers) &&
            impressedTeachers.map(tch => (
              <div className='slick-item' key={tch._id}>
                <TeacherCard teacher={tch} />
              </div>
            ))}
        </Slider>
      </div>

      <div className='statics mt-5 px-3 py-5 text-dark bg-light'>
        <h4 style={{ fontSize: 30 }} className='text-center mb-5'>
          Reached numbers
        </h4>

        <Row>
          <Col xs={12} md={4} className='item mt-3 mt-md-0'>
            <div>4k</div>
            <div>Active users</div>
          </Col>
          <Col xs={12} md={4} className='item mt-3 mt-md-0'>
            <div>800</div>
            <div>Teachers</div>
          </Col>
          <Col xs={12} md={4} className='item mt-3 mt-md-0'>
            <div>23k</div>
            <div>Completed jobs</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
