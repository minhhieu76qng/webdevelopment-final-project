import React from 'react';
import _ from 'lodash';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Modal, Form, Button } from 'react-bootstrap';
import ROLE from '../../constance/Role';
import generalConst from '../../constance/general';

const ModalSetContractName = ({
  account,
  selectedItems,
  show,
  setShow,
  onSubmit: onFormSubmit,
}) => {
  const getInitialValues = () => {
    if (!selectedItems || !_.isArray(selectedItems)) return {};
    const res = {};
    selectedItems.map(val => {
      res[val] = '';
      return 1;
    });
    return res;
  };

  const getSchema = () => {
    if (!selectedItems || !_.isArray(selectedItems)) return {};
    const tmp = {};
    selectedItems.map(val => {
      tmp[val] = yup
        .string()
        .required('Field is required.')
        .trim()
        .max(
          generalConst.MaxLengthContractName,
          'Maximum length is 35 characters.',
        );
      return 1;
    });

    return yup.object().shape(tmp);
  };

  return (
    <>
      {account && account.role === ROLE.teacher && (
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter contracts name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={getInitialValues()}
              validationSchema={getSchema()}
              onSubmit={values => onFormSubmit(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  {selectedItems &&
                    _.isArray(selectedItems) &&
                    selectedItems.map((val, idx) => (
                      <Form.Group key={val}>
                        <Form.Label>{`Contract ${idx + 1}`}</Form.Label>
                        <Form.Control
                          size='sm'
                          name={`${val}`}
                          value={values[val]}
                          onChange={handleChange}
                          isValid={touched[val] && !errors[val]}
                          isInvalid={touched[val] && !!errors[val]}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors[val]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ))}
                  <div className='text-center'>
                    <Button type='submit' size='sm' variant='primary'>
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ModalSetContractName;
