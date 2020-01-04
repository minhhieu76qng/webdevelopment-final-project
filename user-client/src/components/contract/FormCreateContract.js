import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import DatePicker from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Axios from 'axios';
import '../../assets/scss/DatePicker.scss';
import { toast } from '../widgets/toast';

const schema = yup.object().shape({
  description: yup.string().required(),
  startingDate: yup.date().required(),
  rentalHour: yup
    .number()
    .min(1)
    .max(500),
});

const FormCreateContract = ({ teacherId, setShow }) => {
  const handleFormSubmit = (values, setSubmitting) => {
    const payload = { ...values };
    payload.teacherId = teacherId;
    Axios.post('/api/user/contracts', payload)
      .then(() => {
        // data: { created, contractId }
        toast.success('Sent contract to teacher.');
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setSubmitting(false);
        setShow(false);
      });
  };
  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        description: '',
        rentalHour: 1,
        startingDate: '',
      }}
      onSubmit={(values, { setSubmitting }) =>
        handleFormSubmit(values, setSubmitting)}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Tell something with teacher:</Form.Label>
              <Form.Control
                size='sm'
                name='description'
                as='textarea'
                style={{ minHeight: 75, maxHeight: 250, overflowY: 'auto' }}
                value={values.description}
                onChange={handleChange}
                isValid={touched.description && !errors.description}
                isInvalid={!!errors.description && touched.description}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>When you want to start:</Form.Label>
              <DatePicker
                value={values.startingDate}
                onDayChange={val => {
                  setFieldValue('startingDate', val);
                }}
                onBlur={() => setFieldTouched('startingDate')}
              />
              {!!errors.startingDate && touched.startingDate && (
                <div className='invalid-fb'>{errors.startingDate}</div>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>How many hours do you want to learn:</Form.Label>
              <Form.Control
                size='sm'
                name='rentalHour'
                value={values.rentalHour}
                onChange={handleChange}
                isValid={touched.rentalHour && !errors.rentalHour}
                isInvalid={!!errors.rentalHour && touched.rentalHour}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.rentalHour}
              </Form.Control.Feedback>
            </Form.Group>
            <div className='d-flex  justify-content-center'>
              <Button
                disabled={isSubmitting}
                size='sm'
                type='submit'
                variant='primary'
                className='mr-2'
              >
                <FontAwesomeIcon className='mr-2' icon={faCheck} />
                {' '}
Submit
              </Button>
              <Button
                disabled={isSubmitting}
                size='sm'
                variant='danger'
                onClick={() => setShow(false)}
              >
                <FontAwesomeIcon className='mr-2' icon={faBan} />
                {' '}
Cancel
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormCreateContract;
