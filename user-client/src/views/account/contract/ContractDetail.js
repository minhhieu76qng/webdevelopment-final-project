import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faMoneyBillAlt,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import { Fade } from 'react-reveal';
import { Spinner, Badge, Button } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import { toast } from '../../../components/widgets/toast';
import '../../../assets/scss/Contract.scss';
import { getStatus } from '../../../helpers/helpers';
import ROLES from '../../../constance/Role';
import ContractStatus from '../../../constance/ContractStatus';

const ContractDetail = ({ account }) => {
  const { contractId } = useParams();
  const [isFetching, setFetching] = useState(false);
  const [contract, setContract] = useState(null);

  const fetchContract = useCallback(() => {
    setFetching(true);
    Axios.get(`/api/user/contracts/detail/${contractId}`)
      .then(({ data: { contract: resContract } }) => {
        setContract(resContract);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [contractId]);

  useEffect(() => {
    fetchContract();
  }, [contractId, fetchContract]);

  const onPayClick = () => {
    // gửi thông tin về server
    /* eslint no-alert: "off" */
    const confirmPayment = window.confirm('Are you sure to pay this course?');
    if (confirmPayment) {
      Axios.put(`/api/user/contracts/${contractId}/payment`)
        .then(({ data: { isUpdated } }) => {
          if (isUpdated) {
            toast.success('Payment success!');
            fetchContract();
          }
        })
        .catch(err => {
          if (err && err.response && err.response.data.error) {
            toast.error(err.response.data.error.msg);
          }
        });
    }
  };

  let teacherName = null;
  let teacherId = null;
  let studentName = null;
  if (contract) {
    if (contract.teacher) {
      const { firstName, lastName } = contract.teacher.name;
      teacherName = `${firstName} ${lastName}`;
      if (contract.teacher.teacherInfo) {
        teacherId = contract.teacher.teacherInfo._id;
      }
    }
    if (contract.student) {
      const { firstName, lastName } = contract.student.name;
      studentName = `${firstName} ${lastName}`;
    }
  }
  return (
    <>
      <div>
        <Link to='/account/contracts'>
          <h5>
            <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
            {' '}
Contracts
          </h5>
        </Link>
      </div>

      <div className='mt-4 contract-detail'>
        {!isFetching && contract && (
          <Fade>
            <div>
              <table className='table-detail'>
                <tbody>
                  <tr>
                    <td className='title'>Contract name:</td>
                    <td className='content font-weight-bold'>
                      {contract.contractName}
                    </td>
                  </tr>
                  <tr>
                    <td className='title'>Teacher:</td>
                    <td className='content'>
                      <Link
                        to={`/teachers/${teacherId}`}
                        style={{ textDecoration: 'underline' }}
                      >
                        {teacherName && teacherName}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className='title'>Student:</td>
                    <td className='content'>{studentName && studentName}</td>
                  </tr>
                  <tr>
                    <td className='title'>Starting date:</td>
                    <td className='content'>
                      {moment(contract.startingDate).format('LL')}
                    </td>
                  </tr>
                  <tr>
                    <td className='title'>Rental hour:</td>
                    <td className='content'>{`${contract.rentalHour}h`}</td>
                  </tr>
                  <tr>
                    <td className='title'>Price per hour:</td>
                    <td className='content'>{`$${contract.pricePerHour}`}</td>
                  </tr>
                  <tr>
                    <td className='title'>Status:</td>
                    <td className='content'>
                      <Badge variant={getStatus(contract.status)}>
                        {_.upperFirst(_.toLower(contract.status))}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className='title'>Status history:</td>
                    <td className='content'>
                      <table className='table-status'>
                        <thead>
                          <tr className='font-weight-bold'>
                            <td style={{ width: '40%', padding: 0 }}>Status</td>
                            <td style={{ padding: 0 }}>Time</td>
                          </tr>
                        </thead>
                        <tbody>
                          {contract.historyStatus &&
                            _.isArray(contract.historyStatus) &&
                            contract.historyStatus.map(status => (
                              <tr>
                                <td>
                                  <Badge variant={getStatus(status.stt)}>
                                    {_.upperFirst(_.toLower(status.stt))}
                                  </Badge>
                                </td>
                                <td>{moment(status.date).format('LL')}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Fade>
        )}
        {isFetching && (
          <div className='text-center'>
            <Spinner animation='border' variant='primary' />
          </div>
        )}
        {!isFetching && !contract && (
          <div className='text-center font-italic'>Contract is not exist.</div>
        )}
      </div>

      {account &&
        account.role === ROLES.student &&
        contract &&
        contract.status !== ContractStatus.paid && (
          <>
            <hr />

            <div>
              <Button
                size='sm'
                variant='success'
                className='mr-2'
                onClick={onPayClick}
              >
                <FontAwesomeIcon className='mr-2' icon={faMoneyBillAlt} />
                {' '}
Pay
              </Button>
              <Button size='sm' variant='danger'>
                <FontAwesomeIcon className='mr-2' icon={faBan} />
                {' '}
Complain
              </Button>
            </div>
          </>
        )}
    </>
  );
};

export default ContractDetail;
