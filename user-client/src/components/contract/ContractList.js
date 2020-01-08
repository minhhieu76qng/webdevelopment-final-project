import React, { useEffect } from 'react';
import { Table, Badge, Spinner, Pagination, Form } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import { Fade } from 'react-reveal';
import ROLES from '../../constance/Role';
import { getStatus } from '../../helpers/helpers';

const ContractList = ({
  account,
  list,
  pagination,
  isFetching,
  onRowClick,
  setPagination,
  total,
  selectMode = false,
  selectedItems,
  setSelectedItems,
}) => {
  useEffect(() => {
    if (selectMode === false && !_.isEmpty(selectedItems)) {
      setSelectedItems([]);
    }
  }, [selectMode, setSelectedItems, selectedItems]);

  const getPagination = () => {
    const items = [];
    for (let i = 1; i <= Math.ceil(total / pagination.limit); i += 1) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === pagination.page}
          onClick={() => setPagination({ ...pagination, page: i })}
        >
          {i}
        </Pagination.Item>,
      );
    }
    return items;
  };

  const toggleAll = event => {
    event.persist();
    const { checked } = event.target;
    if (_.isArray(list)) {
      if (checked) {
        const tmp = list.map(val => _.toString(val._id));
        setSelectedItems(tmp);
      } else {
        setSelectedItems([]);
      }
    }
  };

  const onSingleTogle = (event, contractId) => {
    event.persist();
    if (selectedItems.indexOf(contractId) === -1) {
      setSelectedItems(s => [...s, contractId]);
    } else {
      setSelectedItems(s => s.filter(val => val !== contractId));
    }
  };

  return (
    <div>
      <Table striped bordered>
        <thead>
          <tr>
            {!selectMode && (
              <td
                className='font-weight-bold text-center'
                style={{ width: '5%' }}
              >
                #
              </td>
            )}
            {selectMode && (
              <td
                className='font-weight-bold text-center'
                style={{ width: '5%' }}
              >
                <Form.Check
                  custom
                  type='checkbox'
                  label=''
                  id='cb-all-contracts'
                  onChange={event => toggleAll(event)}
                  checked={
                    list &&
                    _.isArray(list) &&
                    _.isArray(selectedItems) &&
                    selectedItems.length > 0 &&
                    selectedItems.length === list.length
                  }
                />
              </td>
            )}

            <td className='font-weight-bold' style={{ width: '35%' }}>
              Contract name / Description
            </td>

            {account && account.role === ROLES.teacher && (
              <td className='font-weight-bold' style={{ width: '25%' }}>
                Student
              </td>
            )}
            {account && account.role === ROLES.student && (
              <td className='font-weight-bold' style={{ width: '25%' }}>
                Teacher
              </td>
            )}

            <td className='font-weight-bold' style={{ width: '20%' }}>
              Begin date
            </td>
            <td className='font-weight-bold' style={{ width: '15%' }}>
              Status
            </td>
          </tr>
        </thead>
        <tbody>
          {!isFetching &&
            list &&
            _.isArray(list) &&
            list.map((ct, index) => {
              const status = getStatus(ct.status);
              const sName = ct.student.name;
              const tName = ct.teacher.name;
              return (
                <Fade key={ct._id}>
                  <tr onClick={() => onRowClick(ct._id)}>
                    {!selectMode && (
                      <td className='text-center'>{index + 1}</td>
                    )}
                    {selectMode && (
                      <td className='text-center'>
                        <Form.Check
                          custom
                          type='checkbox'
                          id={`cb-contract-${ct._id}`}
                          label=''
                          checked={
                            selectedItems &&
                            _.isArray(selectedItems) &&
                            selectedItems.indexOf(`${ct._id}`) !== -1
                          }
                          onChange={event =>
                            onSingleTogle(event, _.toString(ct._id))}
                        />
                      </td>
                    )}

                    {ct.contractName && (
                      <td className='font-weight-bold' style={{ width: '35%' }}>
                        {ct.contractName}
                      </td>
                    )}
                    {!ct.contractName && (
                      <td className='font-weight-bold' style={{ width: '35%' }}>
                        {ct.requestMsg}
                      </td>
                    )}

                    {account && account.role === ROLES.teacher && (
                      <td>{`${sName.firstName} ${sName.lastName}`}</td>
                    )}
                    {account && account.role === ROLES.student && (
                      <td>{`${tName.firstName} ${tName.lastName}`}</td>
                    )}

                    <td>{moment(ct.startingDate).format('L')}</td>

                    {status && (
                      <td>
                        <Badge variant={status}>
                          {_.upperFirst(_.toLower(ct.status))}
                        </Badge>
                      </td>
                    )}
                  </tr>
                </Fade>
              );
            })}
          {!isFetching && (!list || (_.isArray(list) && list.length === 0)) && (
            <tr>
              <td className='text-center text-dark font-italic' colSpan={6}>
                No contracts
              </td>
            </tr>
          )}

          {isFetching && (
            <tr>
              <td className='text-center' colSpan={6}>
                <Spinner animation='border' variant='primary' />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {!isFetching && (
        <Fade>
          <div className='d-flex justify-content-end mt-3'>
            <Pagination className='mb-0' size='sm'>
              {getPagination()}
            </Pagination>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default ContractList;
