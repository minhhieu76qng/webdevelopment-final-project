import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { sendMessage } from '../../socket/SocketManager';
import { toast } from '../widgets/toast';
import TokenStorage from '../../utils/TokenStorage';

const schema = yup.object().shape({
  msg: yup.string().required(),
});

const ChatBox = ({ onSend }) => {
  const { toUserId } = useParams();
  const account = TokenStorage.decode();

  const onChatSubmit = (values, resetForm) => {
    if (!toUserId || !_.isString(toUserId)) {
      toast.error('Not found user id.');
      return;
    }
    const { msg } = values;
    onSend({ from: account._id, to: toUserId, msg, time: new Date() });
    sendMessage({ to: toUserId, msg }, error => {
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
