import React from 'react';
import { Table, Badge, Spinner, Pagination } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import { Fade } from 'react-reveal';
import ContractStatus from '../../constance/ContractStatus';

const ContractList = ({
  list,
  page,
  total,
  isFetching,
  onRowClick,
  onPageClick,
}) => {
  const getStatus = stt => {
    switch (stt) {
      case ContractStatus.pending:
        return 'warning';
      case ContractStatus.teaching:
        return 'info';
      case ContractStatus.paid:
        return 'success';
      case ContractStatus.complain:
        return 'danger';
      default:
        return null;
    }
  };

  const getPagination = () => {
    const items = [];
    for (let i = 1; i <= total; i += 1) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => onPageClick(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }
    return items;
  };

  return (
    <div>
      <Table striped bordered>
        <thead>
          <tr>
            <td style={{ width: '5%' }}>#</td>
            <td style={{ width: '30%' }}>Name of Contract</td>
            <td style={{ width: '20%' }}>Student</td>
            <td style={{ width: '20%' }}>Teacher</td>
            <td style={{ width: '15%' }}>Begin date</td>
            <td style={{ width: '10%' }}>Status</td>
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
                    <td>{index + 1}</td>
                    <td>{ct.contractName}</td>
                    <td>{`${sName.firstName} ${sName.lastName}`}</td>
                    <td>{`${tName.firstName} ${tName.lastName}`}</td>
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
