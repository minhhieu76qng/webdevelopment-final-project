import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import { toast } from '../../../components/widgets/toast';

const formIntroSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
});

const UpdateIntro = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const getMe = () => {
    Axios.get(`/api/user/teachers/me`)
      .then(({ data: { teacher } }) => {
        setTeacherInfo(teacher);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  };

  useEffect(() => {
    getMe();
  }, []);

  const formIntroSubmit = (values, setSubmitting) => {
    Axios.put('/api/user/teachers/me/intro', { intro: values })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Update intro successfully');
          getMe();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <div>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={8} lg={6}>
          {teacherInfo && (
            <Formik
              validationSchema={formIntroSchema}
              initialValues={{
                title: teacherInfo.intro ? teacherInfo.intro.title : '',
                content: teacherInfo.intro ? teacherInfo.intro.content : '',
              }}
              onSubmit={(values, { setSubmitting }) =>
                formIntroSubmit(values, setSubmitting)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label className='font-weight-bold'>Title:</Form.Label>
                    <Form.Control
                      size='sm'
                      type='text'
                      name='title'
                      placeholder='Title'
                      value={values.title}
                      onChange={handleChange}
                      isInvalid={!!errors.title}
                      isValid={touched.title && !errors.title}
                      plaintext={!showEdit}
                      readOnly={!showEdit}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className='font-weight-bold'>
                      Content:
                    </Form.Label>
                    <Form.Control
                      size='sm'
                      type='text'
                      as='textarea'
                      name='content'
                      placeholder='Content'
                      style={{ minHeight: 150 }}
                      value={values.content}
                      onChange={handleChange}
                      isInvalid={!!errors.content}
                      isValid={touched.content && !errors.content}
                      plaintext={!showEdit}
                      readOnly={!showEdit}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.content}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className='text-center'>
                    {!showEdit && (
                      <Button
                        variant='warning'
                        size='sm'
                        onClick={() => setShowEdit(true)}
                      >
                        Edit now
                      </Button>
                    )}
                    {showEdit && (
                      <>
                        <Button
                          size='sm'
                          variant='primary'
                          type='submit'
                          className='mr-2'
                        >
                          Submit
                        </Button>
                        <Button
                          size='sm'
                          variant='danger'
                          onClick={() => setShowEdit(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UpdateIntro;
