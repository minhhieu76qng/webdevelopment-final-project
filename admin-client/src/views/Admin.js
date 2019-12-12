import React, { useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Row,
  Col,
  Button,
  Card,
  Spin,
  notification,
} from 'antd';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import constance from '../constance/const';
import TokenStorage from '../utils/TokenStorage';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const col2FormItem = {
  labelCol: {
    sm: {
      span: 4,
    },
    md: {
      span: 8,
    },
  },
  wrapperCol: {
    sm: {
      span: 20,
    },
    md: {
      span: 16,
    },
  },
};

const Admin = ({ form }) => {
  const { getFieldDecorator, validateFields, resetFields } = form;
  const [loading, setLoading] = useState(false);

  const currentLoggedUser = TokenStorage.decode();
  if (currentLoggedUser.role !== constance.ROLES.root) {
    return <Redirect to='/unauthorized' />;
  }

  const formSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        Axios.post('/api/admin/accounts', values)
          .then(() => {
            notification.success({
              message: 'Create new admin successfully',
            });
            resetFields();
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
    <Row type='flex' justify='center'>
      <Col>
        <Card style={{ maxWidth: 550 }}>
          <Spin spinning={loading} delay={500} size='large'>
            <Typography.Title
              level={3}
              style={{ textAlign: 'center', marginBottom: 30 }}
            >
              Create new Administrator
            </Typography.Title>
            <Form
              hideRequiredMark
              colon={false}
              layout='horizontal'
              onSubmit={formSubmit}
            >
              <Row gutter={20}>
                <Col sm={24} md={12}>
                  <Form.Item hasFeedback label='First name' {...col2FormItem}>
                    {getFieldDecorator('firstName', {
                      rules: [
                        {
                          required: true,
                          message: 'Field is required',
                        },
                      ],
                    })(<Input placeholder='First name' />)}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12}>
                  <Form.Item hasFeedback label='Last name' {...col2FormItem}>
                    {getFieldDecorator('lastName', {
                      rules: [
                        {
                          required: true,
                          message: 'Field is required',
                        },
                      ],
                    })(<Input placeholder='Last name' />)}
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item hasFeedback label='Email' {...formItemLayout}>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Field is required',
                    },
                    {
                      validator(rule, value, callback) {
                        if (!constance.EMAIL_PATTERN.test(value)) {
                          return callback('Email is not valid');
                        }
                        return callback();
                      },
                    },
                  ],
                })(<Input placeholder='Email' />)}
              </Form.Item>

              <Form.Item hasFeedback label='Password' {...formItemLayout}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Field is required',
                    },
                    {
                      min: constance.MIN_LENGTH_PASSWORD,
                      /* eslint prefer-template: "off" */
                      message:
                        'Password must be at least ' +
                        constance.MIN_LENGTH_PASSWORD +
                        ' characters',
                    },
                  ],
                })(<Input placeholder='Password' type='password' />)}
              </Form.Item>

              <Form.Item style={{ textAlign: 'center' }}>
                <Button htmlType='submit' type='primary'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

const WrappedAdmin = Form.create('form_create_admin')(Admin);

export default WrappedAdmin;
