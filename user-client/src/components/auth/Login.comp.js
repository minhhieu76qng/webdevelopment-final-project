import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Modal,
  ButtonGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactFacebookLogin from 'react-facebook-login';
import ReactGoogleLogin from 'react-google-login';
import * as yup from 'yup';
import { Formik } from 'formik';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import '../../assets/scss/AuthForm.scss';
import Axios from 'axios';
import TokenStorage from '../../utils/TokenStorage';
import { toast } from '../widgets/toast';
import JOB from '../../constance/Role';

const MESSAGE = {
  required: 'Field is required',
  email: 'Email is not valid',
};

const schema = yup.object({
  email: yup
    .string()
    .required(MESSAGE.required)
    .email(MESSAGE.email),
  password: yup.string().required(MESSAGE.required),
});

const LoginComp = () => {
  const history = useHistory();

  const [userJob, setUserJob] = useState(null);
  const [socialLogin, setSocialLogin] = useState({ type: null, token: null });
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    if (TokenStorage.isValid()) {
      history.push('/');
    }
  }, [history]);

  const formSubmit = (values, setSubmitting) => {
    Axios.post('/api/auth/login', {
      email: values.email,
      password: values.password,
    })
      .then(({ data: { token } }) => {
        TokenStorage.set(token);
        history.push('/');
      })
      .catch(
        ({
          response: {
            data: { error },
          },
        }) => {
          toast.error(error.msg);
        },
      )
      .finally(() => {
        setSubmitting(false);
      });
  };

  const loginWithGoogle = () => {
    Axios.post('/api/auth/oauth/google', {
      access_token: socialLogin.token,
      job: userJob,
    })
      .then(({ data: { token } }) => {
        TokenStorage.set(token);
        history.push('/');
      })
      .catch(err => {
        toast.error(err.response.data.error.msg);
      });
  };

  const responseGoogle = response => {
    console.log(response);
    if (response) {
      const { accessToken } = response;
      setSocialLogin({ type: 'google', token: accessToken });

      console.log(accessToken);

      // check exist user
      Axios.get('/api/auth/oauth/google/is-available', {
        access_token: accessToken,
      })
        .then(({ data: { isExist } }) => {
          if (!isExist) {
            // show ra panel chon job
            setShowJobModal(true);
          } else {
            loginWithGoogle();
          }
        })
        .catch(err => {
          toast.error(err.response.data.error.msg);
        });
    }
  };

  const responseFacebook = response => {
    console.log(response);
  };

  const onJobClick = job => {
    setShowJobModal(false);
    if (job === JOB.student || job === JOB.teacher) {
      setUserJob(job);
      switch (socialLogin.type) {
        case 'google':
          loginWithGoogle();
          break;
        case 'facebook':
          break;
        default:
      }
    }
  };

  const {
    REACT_APP_GOOGLE_CLIENT_ID,
    REACT_APP_FACEBOOK_CLIENT_ID,
  } = process.env;
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) =>
        formSubmit(values, setSubmitting)}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <div className='form-wrapper'>
          <Row className='justify-content-center'>
            <Col xs={12} sm={10} md={8} lg={6} style={{ maxWidth: 500 }}>
              <Form noValidate className='form shadow' onSubmit={handleSubmit}>
                <h3 className='form-title'>Log in and get to work</h3>
                <InputGroup className='mb-3' size='sm'>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name='email'
                    size='sm'
                    type='email'
                    placeholder='Email'
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className='mb-3' size='sm'>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name='password'
                    size='sm'
                    type='password'
                    placeholder='Password'
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    isValid={touched.password && !errors.password}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>

                <Button
                  type='submit'
                  block
                  className='button-link mb-3'
                  size='sm'
                >
                  {isSubmitting ? (
                    <Spinner size='sm' animation='border' />
                  ) : (
                    'Log In'
                  )}
                </Button>

                <div
                  className='mb-3'
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    New with our? &nbsp;
                    <Link className='default-link' to='/sign-up'>
                      Sign up now
                    </Link>
                  </span>
                  <Link className='default-link' to='/forgot-password'>
                    Dont remember password?
                  </Link>
                </div>

                <hr style={{ margin: '20px 0' }} />
                <div className='social-login'>
                  <ReactFacebookLogin
                    appId={REACT_APP_FACEBOOK_CLIENT_ID}
                    autoLoad={false}
                    icon='fa-facebook'
                    cssClass='btn btn-primary btn-sm facebook-button'
                    textButton='Login with Facebook'
                    fields='name,email,picture'
                    callback={responseFacebook}
                  />
                  <ReactGoogleLogin
                    clientId={REACT_APP_GOOGLE_CLIENT_ID}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy='single_host_origin'
                    render={props => (
                      <Button
                        size='sm'
                        onClick={props.onClick}
                        disabled={props.disabled}
                        variant='danger'
                      >
                        <FontAwesomeIcon icon={faGoogle} />
                        {' '}
Login with Google
                      </Button>
                    )}
                  />
                </div>
              </Form>
            </Col>
          </Row>

          <Modal
            centered
            show={showJobModal}
            onHide={() => setShowJobModal(false)}
            aria-labelledby='example-modal-sizes-title-sm'
          >
            <Modal.Header closeButton>
              <Modal.Title id='example-modal-sizes-title-sm'>
                I want to
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
              <ButtonGroup className='job-buttons'>
                <Button
                  className='button-link'
                  onClick={() => onJobClick(JOB.student)}
                >
                  Find a Teacher
                </Button>
                <Button
                  className='button-link'
                  onClick={() => onJobClick(JOB.teacher)}
                >
                  Work as a Teacher
                </Button>
              </ButtonGroup>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </Formik>
  );
};

export default LoginComp;
