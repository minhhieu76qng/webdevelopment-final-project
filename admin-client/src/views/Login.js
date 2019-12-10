import React, { useEffect, useState } from 'react';
import { Form, Icon, Input, Button, Card, notification, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import '../assets/scss/Login.scss';
import logo from '../assets/imgs/logo.png';
import constance from '../constance/const';
import TokenStorage from '../utils/TokenStorage';

const Login = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (TokenStorage.isValid()) {
      history.push('/');
    }
  }, [history]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        Axios.post('/api/admin/auth/login', values)
          .then(({ data: { token } }) => {
            TokenStorage.set(token);
            history.push('/');
          })
          .catch(({ response: { data } }) => {
            if (data && data.error) {
              notification.error({
                message: data.error.msg,
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <div style={{ minHeight: window.innerHeight }} className='login-form'>
      <Card style={{ width: 300, marginTop: 50 }}>
        <Spin spinning={loading} delay={500} size='large'>
          <div style={{ marginBottom: 20 }}>
            <img style={{ maxWidth: '100%' }} src={logo} alt='logo' />
          </div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your email!' },
                  {
                    validator(rule, value, callback) {
                      if (constance.EMAIL_PATTERN.test(value)) {
                        return callback();
                      }
                      return callback('Email is not valid!');
                    },
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='Email'
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type='password'
                  placeholder='Password'
                />,
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

const WrappedLogin = Form.create({ name: 'normal_login' })(Login);

export default WrappedLogin;
