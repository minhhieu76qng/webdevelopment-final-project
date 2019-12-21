import React from 'react';
import { Card, Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import avatarDefault from '../../assets/imgs/avatar.jpg';

const SkeletonLoadingCard = () => {
  return (
    <Card className='shadow rounded text-center'>
      <div style={{ backgroundColor: '#162ec9', width: '100%', height: 4 }} />
      <div className='d-flex justify-content-center mb-2 pt-3'>
        <Skeleton circle width={75} height={75} />
      </div>
      <Card.Body>
        <Skeleton count={3} />
      </Card.Body>
      <Card.Footer>
        <Skeleton />
      </Card.Footer>
    </Card>
  );
};

const TeacherCard = ({ teacher, loading }) => {
  let cloneTeacher = null;
  if (teacher) {
    const { firstName, lastName } = teacher.account.name;
    cloneTeacher = {
      name: `${firstName} ${lastName}`,
      avatar: teacher.account.avatar ? teacher.account.avatar : avatarDefault,
      rate: (teacher.completedRate / 100) * 5,
      address: teacher.account.address
        ? teacher.account.address.city.name
        : null,
      catName: teacher.categories ? teacher.categories.name : null,
    };
  }

  return (
    <>
      {loading && <SkeletonLoadingCard />}
      {!loading && cloneTeacher && (
        <Link to={`/teachers/${teacher._id}`}>
          <Card className='shadow rounded text-center'>
            <div
              style={{ backgroundColor: '#162ec9', width: '100%', height: 4 }}
            />
            <Card.Img
              variant='top'
              as='div'
              className='d-flex justify-content-center pt-3'
            >
              <Image
                style={{ width: 75, height: 75 }}
                roundedCircle
                src={cloneTeacher.avatar}
              />
            </Card.Img>
            <Card.Body>
              <Card.Title>{cloneTeacher.name}</Card.Title>
              <Card.Text className='text-body'>
                {cloneTeacher.catName}
              </Card.Text>
              <p
                style={{ fontSize: 11 }}
                className='font-italic text-dark mb-0'
              >
                {cloneTeacher.address}
              </p>
            </Card.Body>
            <Card.Footer>
              <StarRatings
                rating={cloneTeacher.rate}
                starDimension='20px'
                starSpacing='3px'
                starRatedColor='#162ec9'
                starHoverColor='#162ec9'
              />
            </Card.Footer>
          </Card>
        </Link>
      )}
    </>
  );
};

export default TeacherCard;
