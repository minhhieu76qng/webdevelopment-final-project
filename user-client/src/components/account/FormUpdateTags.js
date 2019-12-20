import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { Form, Badge, Button } from 'react-bootstrap';
import Axios from 'axios';
import Select from 'react-select';
import { toast } from '../widgets/toast';

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
const FormUpdateTags = ({ teacher, fetchTeacher }) => {
  const [tagList, setTagList] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

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

  const formEditTagsSubmit = (values, setSubmitting) => {
    const temp = values.select_tags.map(val => val.value);
    // kiem tra co them moi hay xoa tag hay khong
    // let isEditted = false;
    // if (temp.length === teacher.tags.length) {
    //   for (let i = 0; i < temp.length; i += 1) {
    //     for (let j = 0; j < teacher.tags; j += 1) {
    //       if (!(teacher.tags[j]._id === temp[i])) {
    //         isEditted = true;
    //         break;
    //       }
    //     }
    //   }
    // } else {
    //   isEditted = true;
    // }

    // if (!isEditted) {
    //   toast.warn('You must add or remove tags to submit form.');
    //   setSubmitting(false);
    //   return;
    // }

    Axios.put(`/api/user/teachers/me/tags`, { tags: temp })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Update tags successfully');
          fetchTeacher();
          setShowEdit(false);
        }
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
        Your skill tags:
        {' '}
        {teacher &&
          _.isArray(teacher.tags) &&
          teacher.tags.map(tag => (
            <Badge key={tag._id} className='mr-2' variant='primary'>
              {tag.name}
            </Badge>
          ))}
      </div>
      {!showEdit && (
        <Button variant='warning' size='sm' onClick={() => setShowEdit(true)}>
          Edit tags
        </Button>
      )}
      {teacher && showEdit && (
        <Formik
          validationSchema={selectTagsSchema}
          initialValues={{
            select_tags: currentTags,
          }}
          onSubmit={(values, { setSubmitting }) =>
            formEditTagsSubmit(values, setSubmitting)}
        >
          {({
            values,
            errors,
            touched,
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
                {!!errors.select_tags && touched.select_tags && (
                  <div style={{ color: 'red', marginTop: '.5rem' }}>
                    {errors.select_tags}
                  </div>
                )}
              </Form.Group>
              <div className='text-center'>
                <Button
                  className='mr-2'
                  disabled={isSubmitting}
                  size='sm'
                  type='submit'
                >
                  Submit
                </Button>
                <Button
                  disabled={isSubmitting}
                  size='sm'
                  variant='secondary'
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
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
