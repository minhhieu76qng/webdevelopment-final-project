import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { sendMessage } from '../../socket/SocketManager';
import { toast } from '../widgets/toast';
import TokenStorage from '../../utils/TokenStorage';

const schema = yup.object().shape({
  msg: yup.string().required(),
});

const ChatBox = ({ onSend, roomId }) => {
  const account = TokenStorage.decode();

  const onChatSubmit = (values, resetForm) => {
    const { msg } = values;
    onSend({ from: account._id, msg, time: new Date() });

    sendMessage({ roomId, msg }, error => {
      if (_.isString(error)) {
        toast.error(error);
        return;
      }
      if (typeof error === 'undefined') {
        toast.success('success');
      }
    });
    resetForm();
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        msg: '',
      }}
      onSubmit={(values, { resetForm }) => onChatSubmit(values, resetForm)}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form noValidate className='d-flex' onSubmit={handleSubmit}>
          <Form.Control
            size='sm'
            type='text'
            name='msg'
            className='mr-2'
            value={values.msg}
            onChange={handleChange}
            autoComplete='false'
            autoFocus
          />
          <Button size='sm' type='submit'>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ChatBox;
