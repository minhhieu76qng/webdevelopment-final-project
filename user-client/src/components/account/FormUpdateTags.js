import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { Form, Badge, Button } from 'react-bootstrap';
import Axios from 'axios';
import Select from 'react-select';
import toast from '../widgets/toast';

const selectTagsSchema = yup.object().shape({
  select_tags: yup
    .array()
    .min(1, 'Pick at least 1 tag')
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    ),
});
const FormUpdateTags = ({ teacher }) => {
  const [tagList, setTagList] = useState(null);

  useEffect(() => {
    // fetch tags
    Axios.get('/api/tags/list')
      .then(({ data: { tags } }) => {
        const temp = tags.map(val => ({
          value: val._id,
          label: val.name,
        }));

        setTagList(temp);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
          toast.info('Please refresh page to fix this issue');
        }
      });
  }, []);

  const handleSubmit = (values, setSubmitting) => {
    const temp = values.select_tags.map(val => ({
      _id: val.value,
    }));

    Axios.put(`/api/user/teachers/${teacher._id}/tags`, { tags: temp })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => setSubmitting(false));
  };

  const currentTags =
    teacher &&
    _.isArray(teacher.tags) &&
    teacher.tags.map(val => ({
      value: val._id,
      label: val.name,
    }));
  return (
    <div style={{ maxWidth: 350 }}>
      <div className='mb-3'>
        Your skill tags:{' '}
        {teacher &&
          _.isArray(teacher.tags) &&
          teacher.tags.map(tag => (
            <Badge key={tag._id} className='mr-2' variant='primary'>
              {tag.name}
            </Badge>
          ))}
      </div>
      {teacher && (
        <Formik
          validationSchema={selectTagsSchema}
          initialValues={{
            select_tags: currentTags,
          }}
          onSubmit={(values, { setSubmitting }) =>
            handleSubmit(values, setSubmitting)
          }
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            handleSubmit,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
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
              </Form.Group>
              <div className='text-center'>
                <Button disabled={isSubmitting} size='sm' type='submit'>
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default FormUpdateTags;
