import React from 'react';
import { Formik } from 'formik';
import Rating from 'react-star-ratings';
import { Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import Axios from 'axios';
import { toast } from '../widgets/toast';

const schema = yup.object().shape({
  text: yup.string().required('Field is required.'),
  rating: yup.number().min(1, 'Minimum number of stars is 1'),
});

const FormRating = ({ contractId, onSuccess }) => {
  const onFormRatingSubmit = (values, setSubmitting) => {
    if (!contractId) {
      return;
    }

    Axios.put(`/api/user/contracts/${contractId}/rating`, {
      text: values.text,
      rating: values.rating,
      date: new Date(),
    })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Rating success!');
          // render
          onSuccess();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  return (
    <Formik
      initialValues={{ text: '', rating: 5 }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) =>
        onFormRatingSubmit(values, setSubmitting)}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form noValidate onSubmit={handleSubmit} style={{ maxWidth: 350 }}>
          <h5 className='mb-3'>Rating teacher</h5>
          <Form.Group>
            <Form.Label>Comment:</Form.Label>
            <Form.Control
              as='textarea'
              style={{ minHeight: 120 }}
              size='sm'
              name='text'
              value={values.text}
              onChange={handleChange}
              isValid={touched.text && !errors.text}
              isInvalid={touched.text && !!errors.text}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.text}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Rate:</Form.Label>
            <div>
              <Rating
                rating={values.rating}
                starDimension='20px'
                starSpacing='3px'
                starRatedColor='#162ec9'
                starHoverColor='#162ec9'
                changeRating={val => setFieldValue('rating', val)}
              />
            </div>
          </Form.Group>
          <div className='text-center'>
            <Button
              disble={isSubmitting}
              type='submit'
              size='sm'
              variant='primary'
            >
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormRating;
