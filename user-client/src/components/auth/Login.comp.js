import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactFacebookLogin from 'react-facebook-login';
import ReactGoogleLogin from 'react-google-login';
import * as yup from 'yup';
import { Formik } from 'formik';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import '../../assets/scss/AuthForm.scss';

const schema = yup.object({
  email: yup
    .string()
    .required()
    .email(),
  password: yup
    .string()
    .required()
    .min(6)
    .trim()
    .lowercase(),
});

const LoginComp = () => {
  const formSubmit = values => {
    console.log(values);
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={formSubmit}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <div className='form-wrapper'>
          <Row className='justify-content-center'>
            <Col xs={12} sm={8} md={6} lg={4} style={{ maxWidth: 500 }}>
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
                  Log In
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
                    icon='fa-facebook'
                    cssClass='btn btn-primary btn-sm facebook-button'
                    textButton='Login with Facebook'
                  />
                  <ReactGoogleLogin
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
        </div>
      )}
    </Formik>
  );
};

export default LoginComp;
