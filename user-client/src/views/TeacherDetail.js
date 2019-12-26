import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, Badge, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import shortid from 'shortid';
import Fade from 'react-reveal/Fade';
import Skeleton from 'react-loading-skeleton';
import Axios from 'axios';
import avatarDefault from '../assets/imgs/avatar.jpg';
import { toast } from '../components/widgets/toast';

const TeacherDetail = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    Axios.get(`/api/user/teachers/${teacherId}`)
      .then(({ data: { teacher: teacherRes } }) => {
        setTeacher(teacherRes);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [teacherId]);

  let cloneTeacher = null;
  if (teacher) {
    const { name, avatar, address, google, facebook, local } = teacher.account;
    let email = null;
    if (google) {
      email = google.email;
    }
    if (facebook) {
      email = facebook.email;
    }
    if (local) {
      email = local.email;
    }
    cloneTeacher = {
      _id: teacher._id,
      avatar: avatar || avatarDefault,
      name: name ? `${name.firstName} ${name.lastName}` : null,
      email: email || null,
      categoryName: teacher.categories ? teacher.categories.name : null,
      price: teacher.pricePerHour > 0 ? teacher.pricePerHour : null,
      totalEarned: teacher.totalEarned,
      totalJob: teacher.totalJob,
      hoursWorked: teacher.hoursWorked,
      completedRate: teacher.completedRate >= 0 ? teacher.completedRate : null,
      address:
        address && address.city
          ? `${address.street} ${address.city.name}`
          : null,
      tags: teacher.tags && _.isArray(teacher.tags) ? teacher.tags : null,
      introTitle: teacher.intro ? teacher.intro.title : null,
      introContent: teacher.intro ? teacher.intro.content : null,
      accountId: teacher.account ? teacher.account._id : null,
    };
  }

  return (
    <>
      {isFetching && <SkeletonPage />}
      {!isFetching && cloneTeacher && (
        <Fade>
          <Row className='teacher-detail'>
            <Col xs={12} md={9}>
              <div className='py-3 px-3 bg-white rounded shadow-lg'>
                <div className='d-flex'>
                  <Image
                    className='d-inline-block'
                    style={{ maxWidth: '100%', width: 75, height: 75 }}
                    src={cloneTeacher.avatar}
                    roundedCircle
                  />
                  <div style={{ flexGrow: 1, paddingLeft: 30 }}>
                    <Row>
                      <Col xs={12} sm={8} md={9}>
                        <p style={{ fontSize: 24 }} className='mb-1'>
                          {cloneTeacher.name}
                        </p>
                        <p className='font-weight-bold'>
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className='d-inline-block mr-2'
                          />
                          {cloneTeacher.address}
                        </p>
                      </Col>
                      <Col xs={12} sm={4} md={3}>
                        <p
                          className='mb-1 font-weight-bold'
                          style={{ fontSize: 16 }}
                        >
                          {cloneTeacher.completedRate}
%
                          {' '}
                          <span className='d-inline d-sm-none'>
                            Job Success
                          </span>
                        </p>
                        <div
                          style={{
                            width: `${cloneTeacher.completedRate}%`,
                            height: 3,
                            backgroundColor: '#162ec9',
                          }}
                          className='mb-1'
                        />
                        <p className='mb-1 d-none d-sm-block'>Job Success</p>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className='intro mt-3'>
                  <p className='title-intro font-weight-bold'>
                    {cloneTeacher.introTitle}
                  </p>
                  <div className='content-intro'>
                    {cloneTeacher.introContent}
                  </div>
                </div>

                <div className='mt-3 statics'>
                  <ul className='row text-center mb-0'>
                    <li className='col-6 col-sm-3'>
                      <h3 className='static-value'>
$
                        {cloneTeacher.price}
                      </h3>
                      <div className='static-title'>Hourly rate</div>
                    </li>
                    <li className='col-6 col-sm-3'>
                      <h3 className='static-value'>
                        $
                        {cloneTeacher.totalEarned}
                      </h3>
                      <div className='static-title'>Total earned</div>
                    </li>
                    <li className='col-6 col-sm-3'>
                      <h3 className='static-value'>{cloneTeacher.totalJob}</h3>
                      <div className='static-title'>Jobs</div>
                    </li>
                    <li className='col-6 col-sm-3'>
                      <h3 className='static-value'>
                        {cloneTeacher.hoursWorked}
                      </h3>
                      <div className='static-title'>Hours worked</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='mt-4 bg-white rounded shadow-lg'>
                <h3
                  className='px-4 py-4 bg-light border-bottom'
                  style={{ fontSize: 18 }}
                >
                  Skills
                </h3>
                <div className='px-3 py-3'>
                  <ul className='tags'>
                    {_.isArray(cloneTeacher.tags) &&
                      cloneTeacher.tags.map(tag => (
                        <li key={shortid.generate()}>
                          <Badge className='tag' variant='light'>
                            {tag.name}
                          </Badge>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col xs={12} md={3}>
              <Button
                className='mt-4 mt-md-0 font-weight-bold'
                variant='success'
                // size='sm'
                block
              >
                Hire this teacher
              </Button>

              <Link
                style={{ textTransform: 'unset', width: '100%' }}
                className='link button-link mt-3 text-center'
                to={{
                  pathname: `/account/messages/?to=${cloneTeacher.accountId}`,
                  state: {
                    to: `/account/messages/?to=${cloneTeacher.accountId}`,
                  },
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className='d-inline-block mr-2'
                />
                Send Message
              </Link>

              <div className='mt-3 bg-white rounded shadow-lg'>
                <p
                  className='font-weight-bold px-4 py-4 bg-light border-bottom'
                  style={{ fontSize: 16, marginBottom: 0 }}
                >
                  Contact with 
                  {' '}
                  {cloneTeacher.name}
.
                </p>
                <div className='px-3 py-3'>
                  <div>
                    <FormControl
                      id='email-box'
                      size='sm'
                      disabled
                      plaintext
                      readOnly
                      defaultValue={cloneTeacher.email}
                      title='Click to copy email'
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Fade>
      )}

      {!isFetching && !cloneTeacher && <div>Not found</div>}
    </>
  );
};

const SkeletonPage = () => {
  return (
    <Row className='teacher-detail'>
      <Col xs={12} md={9}>
        <div className='py-3 px-3 bg-white rounded shadow-lg'>
          <div className='d-flex'>
            <Skeleton
              circle
              width={75}
              height={75}
              className='d-inline-block'
            />
            <div style={{ flexGrow: 1, paddingLeft: 30 }}>
              <Row>
                <Col xs={12} sm={8} md={9}>
                  <div>
                    <Skeleton width={100} />
                  </div>
                  <div>
                    <Skeleton width={150} />
                  </div>
                </Col>
                <Col xs={12} sm={4} md={3}>
                  <Skeleton width='50%' />
                </Col>
              </Row>
            </div>
          </div>
          <div className='intro mt-3'>
            <p className='title-intro font-weight-bold'>
              <Skeleton width='50%' />
            </p>
            <div className='content-intro'>
              <Skeleton count={6} />
            </div>
          </div>

          <div className='mt-3 statics'>
            <ul className='row text-center mb-0'>
              <li className='col-6 col-sm-3'>
                <h3 className='static-value'>
                  <Skeleton />
                </h3>
                <div className='static-title'>Hourly rate</div>
              </li>
              <li className='col-6 col-sm-3'>
                <h3 className='static-value'>
                  <Skeleton />
                </h3>
                <div className='static-title'>Total earned</div>
              </li>
              <li className='col-6 col-sm-3'>
                <h3 className='static-value'>
                  <Skeleton />
                </h3>
                <div className='static-title'>Jobs</div>
              </li>
              <li className='col-6 col-sm-3'>
                <h3 className='static-value'>
                  <Skeleton />
                </h3>
                <div className='static-title'>Hours worked</div>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-4 bg-white rounded shadow-lg'>
          <h3
            className='px-4 py-4 bg-light border-bottom'
            style={{ fontSize: 18 }}
          >
            Skills
          </h3>
          <div className='px-3 py-3'>
            <ul className='tags'>
              <li style={{ minWidth: 70 }}>
                <Skeleton />
              </li>
              <li style={{ minWidth: 70 }}>
                <Skeleton />
              </li>
              <li style={{ minWidth: 70 }}>
                <Skeleton />
              </li>
            </ul>
          </div>
        </div>
      </Col>
      <Col xs={12} md={3}>
        <div className='mt-3 mt-sm-0 bg-white rounded shadow-lg'>
          <p
            className='mb-0 font-weight-bold px-4 py-4 bg-light border-bottom'
            style={{ fontSize: 16 }}
          >
            Contact with.
          </p>
          <div className='px-3 py-3'>
            <div className='d-flex'>
              <span>Email:</span>
              {' '}
              <div style={{ flexGrow: 1, marginLeft: 10 }}>
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TeacherDetail;
