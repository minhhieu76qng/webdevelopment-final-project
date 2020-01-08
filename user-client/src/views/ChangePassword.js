import React from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Spinner, Row, Col, Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { equalTo, MESSAGE } from '../constance/yupValidation';
import { toast } from '../components/widgets/toast';

yup.addMethod(yup.string, 'equalTo', equalTo);
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required()
    .min(6, MESSAGE.min(6)),
  confirmPw: yup
    .string()
    .required(MESSAGE.required)
    .equalTo(yup.ref('newPassword'), MESSAGE.equalTo),
});

const ChangePassword = () => {
  const { token } = useParams();

  const formSubmit = (values, setSubmitting) => {
    Axios.put('/api/user/auth/forgot-password', {
      token,
      newPassword: values.newPassword,
      confirmPw: values.confirmPw,
    })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Change password successfully!');
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
      initialValues={{ newPassword: '', confirmPw: '' }}
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
                <h3 className='form-title'>Create new password</h3>
                <Form.Group>
                  <Form.Control
                    name='newPassword'
                    size='sm'
                    type='password'
                    placeholder='New password'
                    value={values.newPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.newPassword}
                    isValid={touched.newPassword && !errors.newPassword}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    name='confirmPw'
                    size='sm'
                    type='password'
                    placeholder='Confirm password'
                    value={values.confirmPw}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPw}
                    isValid={touched.confirmPw && !errors.confirmPw}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.confirmPw}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type='submit' block className='button-link' size='sm'>
                  {isSubmitting ? (
                    <Spinner size='sm' animation='border' />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </Formik>
  );
};

export default ChangePassword;
