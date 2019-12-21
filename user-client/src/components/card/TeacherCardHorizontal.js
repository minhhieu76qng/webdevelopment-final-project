import React from 'react';
import { Image, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Fade } from 'react-reveal';
import Skeleton from 'react-loading-skeleton';
import avatarDefault from '../../assets/imgs/avatar.jpg';
import '../../assets/scss/CardHorizontal.scss';

const SkeletonHorizontal = () => {
  return (
    <div className='card-horizontal'>
      <div className='teacher-infomation'>
        <div className='cover-img'>
          <Skeleton circle width={70} height={70} />
          <p className='d-block d-sm-none text-center mt-2 mb-0'>
            <Skeleton width={30} />
          </p>
        </div>
        <div className='infomation'>
          <div>
            <Skeleton width='50%' />
          </div>
          <div className='mt-2'>
            <Skeleton width='75%' />
          </div>
          <Row className='mt-3'>
            <Col xs={0} sm={2} className='d-none d-sm-block'>
              <Skeleton width={50} />
            </Col>
            <Col xs={6} sm={5} className='job-success'>
              <Skeleton width={80} />
            </Col>
            <Col xs={6} sm={5}>
              <Skeleton width={80} />
            </Col>
          </Row>
        </div>
      </div>
      <div className='blocks'>
        <div className='wrapper'>
          <ul className='tags'>
            <li>
              <Skeleton width={100} />
            </li>
            <li>
              <Skeleton width={130} />
            </li>
            <li>
              <Skeleton width={110} />
            </li>
          </ul>
        </div>
      </div>
      <div className='blocks'>
        <div className='wrapper'>
          <div className='intro'>
            <Skeleton count={4} />
          </div>
          <div className='mt-3'>
            <Link
              to='/teachers/id'
              className='link button-link'
              style={{ textTransform: 'unset' }}
            >
              Expand Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherCardHorizontal = ({ loadding, teacher }) => {
  if (loadding) {
    return <SkeletonHorizontal />;
  }
  const { name, avatar, address } = teacher.account;
  const cloneTeacher = {
    _id: teacher._id,
    avatar: avatar || avatarDefault,
    name: name ? `${name.firstName} ${name.lastName}` : null,
    categoryName: teacher.categories ? teacher.categories.name : null,
    price: teacher.pricePerHour > 0 ? teacher.pricePerHour : null,
    completedRate: teacher.completedRate >= 0 ? teacher.completedRate : null,
    city: address && address.city ? address.city.name : null,
    tags: teacher.tags && _.isArray(teacher.tags) ? teacher.tags : null,
    introContent: teacher.intro ? teacher.intro.content : null,
  };
  return (
    <Fade>
      <div className='card-horizontal'>
        <div className='teacher-infomation'>
          <div className='cover-img'>
            <Image src={cloneTeacher.avatar} roundedCircle />
            <p className='d-block d-sm-none text-center mt-2 mb-0'>
              <span className='font-weight-bold'>
$
                {cloneTeacher.price}
              </span>
              /hr
            </p>
          </div>
          <div className='infomation'>
            <div>
              <Link
                className='active teacher-name'
                to={`/teachers/${cloneTeacher._id}`}
              >
                {cloneTeacher.name}
              </Link>
            </div>
            <p className='mt-2 mb-0'>{cloneTeacher.categoryName}</p>
            <Row className='mt-3'>
              <Col xs={0} sm={2} className='d-none d-sm-block'>
                <span className='font-weight-bold'>
$
                  {cloneTeacher.price}
                </span>
                /hr
              </Col>
              <Col xs={6} sm={5} className='job-success'>
                <FontAwesomeIcon icon={faThumbsUp} className='mr-2' />
                {' '}
                {cloneTeacher.completedRate}
% Job Success
              </Col>
              <Col xs={6} sm={5}>
                <div className='text-dark font-italic'>{cloneTeacher.city}</div>
              </Col>
            </Row>
          </div>
        </div>
        <div className='blocks'>
          <div className='wrapper'>
            <ul className='tags'>
              {cloneTeacher.tags.map(tag => (
                <li key={tag._id}>
                  <Badge className='tag' variant='light'>
                    {tag.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='blocks'>
          <div className='wrapper'>
            <div className='intro' style={{ whiteSpace: 'pre-wrap' }}>
              {cloneTeacher.introContent}
            </div>
            <div className='mt-3'>
              <Link
                to={`/teachers/${cloneTeacher._id}`}
                className='link button-link'
                style={{ textTransform: 'unset' }}
              >
                Expand Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default TeacherCardHorizontal;
