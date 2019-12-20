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
import '../assets/scss/AuthForm.scss';
import Axios from 'axios';
import TokenStorage from '../utils/TokenStorage';
import { toast } from '../components/widgets/toast';
import JOB from '../constance/Role';

const MESSAGE = {
  required: 'Field is required',
  email: 'Email is not valid',
};

const SocialType = {
  google: 'google',
  facebook: 'facebook',
};

const schema = yup.object({
  email: yup
    .string()
    .required(MESSAGE.required)
    .email(MESSAGE.email),
  password: yup.string().required(MESSAGE.required),
});

const Login = ({ fetchAccount }) => {
  const history = useHistory();

  const [socialLogin, setSocialLogin] = useState({ type: null, token: null });
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    if (TokenStorage.isValid()) {
      history.push('/');
    }
  }, [history]);

  const formSubmit = (values, setSubmitting) => {
    Axios.post('/api/user/auth/login', {
      email: values.email,
      password: values.password,
    })
      .then(({ data: { token } }) => {
        TokenStorage.set(token);
        fetchAccount();
        history.push('/');
      })
      .catch(({ response: { data: { error } } }) => {
        toast.error(error.msg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const loginWithSocial = (socialType, token, job) => {
    const reqBodyObj = {
      access_token: token,
    };
    if (job !== null && (job === JOB.student || job === JOB.teacher)) {
      reqBodyObj.job = job;
    }
    Axios.post(`/api/user/auth/oauth/${socialType}`, reqBodyObj)
      .then(({ data }) => {
        if (data.isExist === false) {
          setShowJobModal(true);
          return;
        }
        TokenStorage.set(data.token);
        fetchAccount();
        history.push('/');
      })
      .catch(err => {
        if (err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  };

  const responseGoogle = response => {
    if (response && !response.error) {
      const { accessToken } = response;
      setSocialLogin({ type: SocialType.google, token: accessToken });

      loginWithSocial(SocialType.google, accessToken);
    }
  };

  const responseFacebook = response => {
    if (response && response.status !== 'unknown') {
      const { accessToken } = response;
      setSocialLogin({ type: SocialType.facebook, token: accessToken });

      loginWithSocial(SocialType.facebook, accessToken);
    }
  };

  const onJobClick = job => {
    setShowJobModal(false);
    if (job === JOB.student || job === JOB.teacher) {
      switch (socialLogin.type) {
        case SocialType.google:
          loginWithSocial(SocialType.google, socialLogin.token, job);
          break;
        case SocialType.facebook:
          loginWithSocial(SocialType.facebook, socialLogin.token, job);
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
                    // autoLoad={true}
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

export default Login;
