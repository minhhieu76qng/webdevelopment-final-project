import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import _ from 'lodash';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
import toast from '../../../components/widgets/toast';
import FormUpdateTags from '../../../components/account/FormUpdateTags';

const schema = yup.object({
  price: yup
    .number()
    .required()
    .min(1),
});

const TeachingInfo = ({ account }) => {
  // update price and skill tags
  const [editting, setEditting] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const getMe = () => {
    Axios.get(`/api/user/teachers/me`)
      .then(({ data: { teacher } }) => {
        setTeacherInfo(teacher);
      })
      .catch(err => {});
  };

  useEffect(() => {
    getMe();
  }, []);

  const formChangePriceSubmit = (values, setSubmitting) => {
    Axios.put(`/api/user/teachers/${teacherInfo._id}/price`, values)
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Update price successfully.');
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setSubmitting(false);
        setEditting(false);
        getMe();
      });
  };

  return (
    <>
      <Row>
        <Col xs={12} md={7} lg={6} xl={4}>
          {teacherInfo && (
            <table className='teaching-info'>
              <tbody>
                <tr>
                  <td className='title'>Completed rate:</td>
                  <td>{teacherInfo.completedRate}%</td>
                </tr>
                <tr>
                  <td className='title'>Total job:</td>
                  <td>{teacherInfo.totalJob}</td>
                </tr>
                <tr>
                  <td className='title'>Total earned:</td>
                  <td>${teacherInfo.totalEarned}</td>
                </tr>
                <tr>
                  <td className='title'>Price/hour:</td>
                  <td>
                    {_.isNumber(teacherInfo.pricePerHour)
                      ? `$${teacherInfo.pricePerHour}`
                      : 'NaN'}{' '}
                    <Button
                      style={{ marginLeft: 10 }}
                      size='sm'
                      variant='warning'
                      onClick={() => setEditting(true)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className='d-inline-block mr-2'
                      />
                      Edit
                    </Button>{' '}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Col>
        <Col xs={12} md={5} lg={6} xl={8}>
          <FormUpdateTags teacher={teacherInfo} />
        </Col>
      </Row>

      <Modal size='sm' show={editting} onHide={() => setEditting(false)}>
        <Modal.Body>
          {teacherInfo && (
            <Formik
              validationSchema={schema}
              initialValues={{
                price: _.isNumber(teacherInfo.pricePerHour)
                  ? teacherInfo.pricePerHour
                  : 0,
              }}
              onSubmit={(values, { setSubmitting }) =>
                formChangePriceSubmit(values, setSubmitting)
              }
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
                isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group as={Row}>
                    <Form.Label className='text-right' column xs={4}>
                      New price:
                    </Form.Label>
                    <Col xs={8}>
                      <Form.Control
                        value={values.price}
                        onChange={handleChange}
                        isValid={touched.price && !errors.price}
                        isInvalid={!!errors.price}
                        name='price'
                        type='text'
                        placeholder='Price per hour'
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.price}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <div className='text-center'>
                    <Button
                      disable={isSubmitting}
                      type='submit'
                      size='sm'
                      variant='primary'
                    >
                      Save changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TeachingInfo;
