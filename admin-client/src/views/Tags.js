import React, { useState, useEffect } from 'react';
import {
  Tag,
  Table,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
} from 'antd';
import moment from 'moment';
import '../assets/scss/Tags.scss';
import _ from 'lodash';
import Axios from 'axios';
import FormItem from 'antd/lib/form/FormItem';

const columns = [
  {
    title: 'Id',
    dataIndex: '_id',
    width: '30%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render: name => {
      return <Tag color='#108ee9'>{name}</Tag>;
    },
    width: '25%',
  },
  {
    title: 'Date added',
    dataIndex: 'dateAdded',
    width: '30%',
  },
  {
    title: 'Status',
    dataIndex: 'isDeleted',
    width: '15%',
    render: isDeleted => {
      if (isDeleted) {
        return <Tag color='red'>Deleted</Tag>;
      }
      return <Tag color='green'>Active</Tag>;
    },
  },
];

const Tags = ({ form }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tablePagination, setTablePagination] = useState({
    pageSize: 5,
  });

  const { getFieldDecorator, validateFields } = form;

  const handleTableChange = pagination => {
    const pager = { ...tablePagination };

    pager.current = pagination.current;
    setTablePagination(pager);
  };

  const fetchTags = () => {
    setIsFetching(true);
    Axios.get(
      `/api/tags?page=${tablePagination.current || 1}&limit=${
        tablePagination.pageSize
      }`,
    )
      .then(({ data: { tags, total } }) => {
        let tempArr = [];

        tags.map(val => {
          const tmp = {
            key: val._id,
            _id: val._id,
            name: val.name,
            dateAdded: moment(new Date(val.createdAt), 'MM-DD-YYYY').format(
              'll',
            ),
            isDeleted: val.isDeleted || false,
          };

          tempArr = tempArr.concat([tmp]);
          return 1;
        });

        const pagination = { ...tablePagination };
        pagination.total = total;
        setTablePagination(pagination);
        setTagList(tempArr);
      })
      .catch(({ response: { data } }) => {
        if (data && data.error) {
          notification.error({
            message: data.error.msg,
          });
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchTags();
  }, [tablePagination.current]);

  const onAddNewTag = e => {
    e.preventDefault();

    validateFields(['newTag'], (err, values) => {
      if (!err) {
        // axios post
        Axios.post('/api/tags', {
          newTag: values.newTag,
        })
          .then(() => {
            // fetch tags list
            notification.success({
              message: 'Add new tags successfully.',
            });

            setShowAddModal(false);
            fetchTags();
          })
          .catch(({ response: { data } }) => {
            if (data && data.error) {
              notification.error({
                message: data.error.msg,
              });
            }
          });
      }
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedTags,
    onChange: selectedRowKeys => {
      setSelectedTags(selectedRowKeys);
    },
  };

  const deleteTags = () => {
    Axios.put('/api/tags', { tags: selectedTags })
      .then(() => {
        notification.success({
          message: 'Delete tag successfully.',
        });
        setSelectedTags([]);
        fetchTags();
      })
      .catch(({ response: { data } }) => {
        if (data && data.error) {
          notification.error({
            message: data.error.msg,
          });
        }
      });
  };

  const onEditTag = e => {
    e.preventDefault();
    validateFields(['eTagName', 'eIsDeleted'], (err, values) => {
      if (!err) {
        let isDeleted = null;
        if (values.eIsDeleted === 'true') {
          isDeleted = true;
        }
        if (values.eIsDeleted === 'false') {
          isDeleted = false;
        }
        const reqBody = {
          tagName: values.eTagName,
          isDeleted,
        };

        Axios.put(`/api/tags/${selectedTags[0]}`, reqBody)
          .then(() => {
            notification.success({
              message: 'Edit tag successfully.',
            });

            setShowEditModal(false);
            setSelectedTags([]);
            fetchTags();
          })
          .catch(({ response: { data } }) => {
            if (data && data.error) {
              notification.error({
                message: data.error.msg,
              });
            }
          });
      }
    });
  };

  let eTag = null;

  if (selectedTags.length === 1) {
    [eTag] = tagList.filter(val => val._id === selectedTags[0]);
  }

  return (
    <>
      <div className='buttons'>
        <Button
          type='primary'
          icon='plus'
          onClick={() => setShowAddModal(true)}
        >
          Add
        </Button>
        {_.isArray(selectedTags) && selectedTags.length === 1 && (
          <Button
            style={{ background: '#f1c40f', color: '#fff' }}
            type='default'
            icon='edit'
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>
        )}
        {_.isArray(selectedTags) && selectedTags.length >= 1 && (
          <Popconfirm
            title='Are you sure to delete selected entries?'
            okText='Yes'
            cancelText='No'
            onConfirm={deleteTags}
          >
            <Button type='danger' icon='delete'>
              Remove
            </Button>
          </Popconfirm>
        )}
      </div>
      <Row>
        <Col lg={16} sm={24}>
          <Table
            loading={isFetching}
            bordered
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tagList}
            onChange={handleTableChange}
            pagination={tablePagination}
          />
        </Col>
      </Row>

      <Modal
        title='Add new tag'
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={false}
      >
        <Form onSubmit={onAddNewTag}>
          <FormItem>
            {getFieldDecorator('newTag', {
              rules: [
                {
                  required: true,
                  message: 'Field is required',
                },
              ],
            })(<Input placeholder='New tag' />)}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button type='primary' htmlType='submit'>
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={false}
        title='Edit tag'
      >
        {_.isArray(selectedTags) && selectedTags.length === 1 && (
          <Form onSubmit={onEditTag}>
            <FormItem>
              {getFieldDecorator('eTagName', {
                rules: [
                  {
                    required: true,
                    message: 'Field is required',
                  },
                ],
                initialValue: eTag.name,
              })(<Input placeholder='Tag' />)}
            </FormItem>
            <Form.Item>
              {getFieldDecorator('eIsDeleted', {
                initialValue: _.toString(eTag.isDeleted),
                rules: [
                  {
                    required: true,
                    message: 'Field is required',
                  },
                ],
              })(
                <Select>
                  <Select.Option value='false'>Active</Select.Option>
                  <Select.Option value='true'>Deleted</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item></Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button
                type='primary'
                htmlType='submit'
                style={{ background: '#f1c40f', color: '#fff' }}
              >
                Edit
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};
const WrappedTags = Form.create('tags')(Tags);
export default WrappedTags;
