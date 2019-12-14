import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Tag,
  notification,
  Modal,
  Row,
  Col,
  Avatar,
  Skeleton,
} from 'antd';
import shortid from 'shortid';
import _ from 'lodash';
import moment from 'moment';
import Axios from 'axios';
import '../assets/scss/User.scss';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '45%',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: '15%',
    render: role => {
      let text = role;
      text = _.lowerCase(text);
      text = _.upperFirst(text);
      return <Tag color='blue'>{text}</Tag>;
    },
  },
  {
    title: 'Status',
    dataIndex: 'isBlock',
    width: '15%',
    render: isBlock => {
      if (!isBlock) {
        return <Tag color='green'>Active</Tag>;
      }

      return <Tag color='red'>Block</Tag>;
    },
  },
];

const rowSelection = {
  onChange: () => {},
  getCheckboxProps: () => ({}),
};

const Users = () => {
  const [listAccount, setListAccount] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [tablePagination, setTablePagination] = useState({ pageSize: 3 });

  const [modalDetail, setModalDetail] = useState(false);
  const [accountDetail, setAccountDetail] = useState(null);

  const handleTableChange = pagination => {
    const pager = { ...tablePagination };

    pager.current = pagination.current;
    setTablePagination(pager);
  };

  const formatData = list => {
    let data = [];
    list.map(account => {
      const temp = {
        _id: account._id,
        name: `${account.name.lastName} ${account.name.firstName}`,
        isBlock: account.isBlock,
        role: account.role,
      };

      if (account.local) {
        temp.email = account.local.email;
      }
      if (account.facebook) {
        temp.email = account.facebook.email;
      }
      if (account.google) {
        temp.email = account.google.email;
      }

      temp.key = shortid.generate();

      data = data.concat([temp]);
      return 1;
    });
    return data;
  };

  const fetchList = useCallback(
    () => {
      setIsFetching(true);
      Axios.get(
        `/api/admin/accounts?limit=${
          tablePagination.pageSize
        }&page=${tablePagination.current || 1}`,
      )
        .then(({ data: { list, total } }) => {
          const data = formatData(list);
          const pagination = { ...tablePagination };
          pagination.total = total;
          setListAccount(data);
          setTablePagination(pagination);
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
    },
    // eslint-disable-next-line
    [tablePagination.current],
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const viewAccountDetail = id => {
    setModalDetail(true);
    setAccountDetail(null);
    // fetch user detail
    Axios.get(`/api/admin/accounts/${id}`)
      .then(({ data: { account } }) => {
        const temp = {
          _id: account._id,
          name: `${account.name.lastName} ${account.name.firstName}`,
          joinDate: moment(new Date(account.createdAt), 'MM-DD-YYYY').format(
            'll',
          ),
          role: _.upperFirst(_.lowerCase(account.role)),
          avatar: account.avatar,
          teacher: account.teacher ? account.teacher : null,
        };

        setAccountDetail(temp);
      })
      .catch(({ response: { data } }) => {
        if (data.error) {
          notification.error({
            message: data.error.msg,
          });
        }
        setModalDetail(false);
      });
  };

  const onRow = record => {
    return {
      onClick: () => viewAccountDetail(record._id),
    };
  };

  return (
    <>
      <Table
        loading={isFetching}
        // rowKey={}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listAccount}
        // size='small'
        pagination={tablePagination}
        onChange={handleTableChange}
        onRow={onRow}
        rowClassName='row-hoverable'
      />

      <Modal
        visible={modalDetail}
        footer={null}
        onCancel={() => setModalDetail(false)}
        title='Detailed account'
        // width='50%'
      >
        {!accountDetail && <Skeleton active />}
        {accountDetail && (
          // hien thi
          <Row gutter={20}>
            <Col span={6}>
              {!accountDetail.avatar && (
                <Avatar shape='square' size={80} icon='user' />
              )}
              {accountDetail.avatar && (
                <Avatar shape='square' size={80} src={accountDetail.avatar} />
              )}
            </Col>
            <Col span={18}>
              <Row gutter={20} className='table'>
                <Col className='title' span={6}>
                  Id:
                </Col>
                <Col className='content' span={18}>
                  {accountDetail._id}
                </Col>
              </Row>
              <Row gutter={20} className='table'>
                <Col className='title' span={6}>
                  Name:
                </Col>
                <Col className='content' span={18}>
                  {accountDetail.name}
                </Col>
              </Row>
              <Row gutter={20} className='table'>
                <Col className='title' span={6}>
                  Role:
                </Col>
                <Col className='content' span={18}>
                  {accountDetail.role}
                </Col>
              </Row>
              <Row gutter={20} className='table'>
                <Col className='title' span={6}>
                  Join date:
                </Col>
                <Col className='content' span={18}>
                  {accountDetail.joinDate}
                </Col>
              </Row>
              {accountDetail.teacher && (
                <>
                  <Row gutter={20} className='table'>
                    <Col className='title' span={6}>
                      Completed rate:
                    </Col>
                    <Col className='content' span={18}>
                      {`${accountDetail.teacher.completedRate}%`}
                    </Col>
                  </Row>
                  <Row gutter={20} className='table'>
                    <Col className='title' span={6}>
                      Total job:
                    </Col>
                    <Col className='content' span={18}>
                      {accountDetail.teacher.totalJob}
                    </Col>
                  </Row>
                  <Row gutter={20} className='table'>
                    <Col className='title' span={6}>
                      Total Earned:
                    </Col>
                    <Col className='content' span={18}>
                      {accountDetail.teacher.totalEarned}
                    </Col>
                  </Row>
                  <Row gutter={20} className='table'>
                    <Col className='title' span={6}>
                      Hours worked:
                    </Col>
                    <Col className='content' span={18}>
                      {accountDetail.teacher.hoursWorked}
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        )}
      </Modal>
    </>
  );
};

export default Users;
