import React from 'react';
import { Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import Axios from 'axios';
import { toast } from '../components/widgets/toast';

const schema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email(),
});

const ForgotPassword = () => {
  const formSubmit = (values, setSubmitting) => {
    Axios.put('/api/user/auth/send-forgot-pw', { email: values.email })
      .then(({ data: { isSent } }) => {
        if (isSent) {
          toast.success('An email has sent to your mail you provide.');
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: '' }}
      onSubmit={(values, { setSubmitting }) =>
        formSubmit(values, setSubmitting)}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleSubmit,
      }) => (
        <div className='form-wrapper'>
          <Row className='justify-content-center'>
            <Col xs={12} sm={10} md={8} lg={6} style={{ maxWidth: 500 }}>
              <Form noValidate className='form shadow' onSubmit={handleSubmit}>
                <h3 className='form-title'>
                  Get your password by email recovery
                </h3>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
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
                </Form.Group>

                <Button
                  type='submit'
                  block
                  className='button-link mb-3'
                  size='sm'
                >
                  {isSubmitting ? (
                    <Spinner size='sm' animation='border' />
                  ) : (
                    'Submit'
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
                  <span>
                    Already have account? &nbsp;
                    <Link className='default-link' to='/login'>
                      Login now
                    </Link>
                  </span>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </Formik>
  );
};

export default ForgotPassword;
