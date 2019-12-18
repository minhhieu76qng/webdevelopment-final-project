import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import Axios from 'axios';
import toast from '../widgets/toast';
import TokenStorage from '../../utils/TokenStorage';

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  city: yup.string().required(),
  street: yup.string().required(),
});

const FormUpdateInfo = ({ account, fetchAccount }) => {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    Axios.get('/api/cities')
      .then(({ data: { cities: list } }) => {
        setCities(list);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  }, []);

  let email = null;
  if (account) {
    if (account.local && account.local.email) {
      email = account.local.email;
    }
    if (account.facebook && account.facebook.email) {
      email = account.facebook.email;
    }
    if (account.google && account.google.email) {
      email = account.google.email;
    }
  }

  let options = null;
  if (cities && _.isArray(cities)) {
    options = cities.map(val => {
      return {
        value: val._id,
        label: val.name,
      };
    });
  }

  const formUpdateSubmit = (values, setSubmitting) => {
    const reqBody = {
      _id: account._id,
      name: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
      address: {
        city: values.city,
        street: values.street,
      },
    };
    Axios.put(`/api/user/accounts/${account._id}`, reqBody)
      .then(({ data: { isUpdated, token } }) => {
        toast.success('Update successfully.');
        // fetch user -> generate new token
        if (isUpdated && token) {
          TokenStorage.set(token);
          fetchAccount();
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
      initialValues={{
        email: email,
        firstName: account.name.firstName,
        lastName: account.name.lastName,
        street: account.address.street,
        city: account.address.city,
      }}
      onSubmit={(values, { setSubmitting }) =>
        formUpdateSubmit(values, setSubmitting)
      }
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        isSubmitting,
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Email
              </Form.Label>
              <Col sm={9}>
                <Form.Control size='sm' disabled defaultValue={values.email} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                First name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  size='sm'
                  type='text'
                  name='firstName'
                  placeholder='First name'
                  value={values.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                  isValid={touched.firstName && !errors.firstName}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.firstName}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Last name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  size='sm'
                  type='text'
                  name='lastName'
                  placeholder='Last name'
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                  isValid={touched.lastName && !errors.lastName}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.lastName}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {options && (
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  City
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size='sm'
                    as='select'
                    name='city'
                    value={values.city}
                    onChange={handleChange}
                    isValid={touched.city && !errors.city}
                    isInvalid={!!errors.city}
                  >
                    {options.map(val => (
                      <option key={val.value} value={val.value}>
                        {val.label}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {errors.city}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            )}
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Street
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  size='sm'
                  type='text'
                  name='street'
                  value={values.street}
                  onChange={handleChange}
                  isValid={touched.street && !errors.street}
                  isInvalid={!!errors.street}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.street}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <div className='text-center'>
              <Button
                disabled={isSubmitting}
                type='submit'
                variant='primary'
                size='sm'
              >
                Submit
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormUpdateInfo;
