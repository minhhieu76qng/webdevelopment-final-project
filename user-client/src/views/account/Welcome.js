import React, { useEffect } from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import * as yup from 'yup';
// import _ from 'lodash';
import { toast } from '../../components/widgets/toast';

const schema = yup.object().shape({
  city: yup.string().required(),
  category: yup.string().required(),
  select_tags: yup
    .array()
    .min(1, 'Pick at least 1 tag')
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    ),
  price: yup
    .number()
    .required()
    .min(5)
    .max(1000),
});

const Welcome = ({
  account,
  categories,
  cities,
  tags,
  fetchCities,
  fetchCategories,
  fetchTags,
  fetchAccount,
}) => {
  useEffect(() => {
    fetchCities();
    fetchTags();
    fetchCategories();
  }, [fetchCities, fetchTags, fetchCategories]);

  const onFormWelcomeSubmit = (values, setSubmitting) => {
    Axios.put('/api/user/teachers/me/welcome', {
      city: values.city,
      category: values.category,
      tags: values.select_tags.map(val => val.value),
      price: values.price,
    })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Update successfully!');
          fetchAccount();
        } else {
          toast.error("Cant't update right now.");
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

  let tagList = null;
  if (tags) {
    tagList = tags.map(val => ({
      value: val._id,
      label: val.name,
    }));
  }

  if (account && account.teacher && account.teacher.firstUpdated === true) {
    return <Redirect to='/account' />;
  }

  return (
    <div>
      <h3 style={{ fontSize: 20 }}>
        One more things to make you visible with others
      </h3>
      <Row className='mt-4'>
        <Col xs={12} md={6} lg={4}>
          <Formik
            validationSchema={schema}
            initialValues={{
              city: '',
              category: '',
              select_tags: [],
              price: '',
            }}
            onSubmit={(values, { setSubmitting }) =>
              onFormWelcomeSubmit(values, setSubmitting)}
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
                    <Form.Label>Tell us about your location:</Form.Label>
                    <Form.Control
                      as='select'
                      size='sm'
                      name='city'
                      value={values.city}
                      onChange={handleChange}
                      isValid={touched.city && !errors.city}
                      isInvalid={!!errors.city}
                    >
                      {cities &&
                        cities.map(ct => (
                          <option key={ct._id} value={ct._id}>
                            {ct.name}
                          </option>
                        ))}
                    </Form.Control>

                    <Form.Control.Feedback type='invalid'>
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Your student level is:</Form.Label>
                    <Form.Control
                      as='select'
                      size='sm'
                      name='category'
                      value={values.category}
                      onChange={handleChange}
                      isValid={touched.category && !errors.category}
                      isInvalid={!!errors.category}
                    >
                      {categories &&
                        categories.map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type='invalid'>
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Your skills are:</Form.Label>
                    <Select
                      name='select_tags'
                      closeMenuOnSelect={false}
                      options={tagList}
                      isMulti
                      value={values.select_tags}
                      onChange={val => setFieldValue('select_tags', val)}
                      onBlur={() => setFieldTouched('select_tags')}
                      isDisabled={isSubmitting}
                    />

                    {!!errors.select_tags && touched.select_tags && (
                      <div className='invalid-fb'>{errors.select_tags}</div>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>What salary do you want in an hour?</Form.Label>
                    <Form.Control
                      size='sm'
                      name='price'
                      value={values.price}
                      onChange={handleChange}
                      isValid={touched.price && !errors.price}
                      isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className='text-center'>
                    <Button size='sm' type='submit'>
                      Submit
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

export default Welcome;
