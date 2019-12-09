import React from 'react';
import { Form, Icon, Input, Button, Card } from 'antd';
import '../assets/scss/Login.scss';
import logo from '../assets/imgs/logo.png';

const Login = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields(err => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <div style={{ minHeight: window.innerHeight }} className='login-form'>
      <Card style={{ width: 300, marginTop: 50 }}>
        <div style={{ marginBottom: 20 }}>
          <img style={{ maxWidth: '100%' }} src={logo} alt='logo' />
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: 'Please input your username!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='Username'
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
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const WrappedLogin = Form.create({ name: 'normal_login' })(Login);

export default WrappedLogin;
