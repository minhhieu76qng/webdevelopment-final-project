import React from 'react';
import { Form, Typography, Input, Row, Col, Button } from 'antd';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const col2FormItem = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Admin = () => {
  return (
    <div style={{ maxWidth: 500 }}>
      <Typography.Title
        level={3}
        style={{ textAlign: 'center', marginBottom: 30 }}
      >
        Create new Administrator
      </Typography.Title>
      <Form layout='horizontal'>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='First name' {...col2FormItem}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Last name' {...col2FormItem}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Email' {...formItemLayout}>
          <Input />
        </Form.Item>

        <Form.Item label='Password' {...formItemLayout}>
          <Input />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type='primary'>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Admin;
