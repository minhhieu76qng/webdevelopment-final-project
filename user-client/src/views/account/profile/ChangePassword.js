import React from 'react';
import * as yup from 'yup';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Axios from 'axios';
import { equalTo, MESSAGE } from '../../../constance/yupValidation';
import { toast } from '../../../components/widgets/toast';

yup.addMethod(yup.string, 'equalTo', equalTo);
const schema = yup.object().shape({
  current: yup
    .string()
    .required(MESSAGE.required)
    .min(6, MESSAGE.min(6)),
  newPassword: yup
    .string()
    .required(MESSAGE.required)
    .min(6, MESSAGE.min(6)),
  confirmPw: yup
    .string()
    .required(MESSAGE.required)
    .equalTo(yup.ref('newPassword'), MESSAGE.equalTo),
});

const ChangePassword = ({ account }) => {
  const formSubmit = (values, setSubmitting) => {
    if (account) {
      Axios.put(`/api/user/accounts/${account._id}/change-password`, values)
        .then(({ data: { isUpdated } }) => {
          if (isUpdated) {
            toast.success('Update password successfully.');
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
    }
  };

  return (
    <Row className='justify-content-md-center'>
      <Col xs={12} md={6} lg={4} style={{ maxWidth: 350 }}>
        <Formik
          validationSchema={schema}
          initialValues={{
            current: '',
            newPassword: '',
            confirmPw: '',
          }}
          onSubmit={(values, { setSubmitting }) =>
            formSubmit(values, setSubmitting)}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  size='sm'
                  type='password'
                  name='current'
                  placeholder='Current password'
                  value={values.current}
                  onChange={handleChange}
                  isInvalid={!!errors.current}
                  isValid={touched.current && !errors.current}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.current}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  size='sm'
                  type='password'
                  name='newPassword'
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
                  size='sm'
                  type='password'
                  name='confirmPw'
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
              <div className='text-center'>
                <Button
                  size='sm'
                  variant='primary'
                  type='submit'
                  className='mr-2'
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default ChangePassword;
