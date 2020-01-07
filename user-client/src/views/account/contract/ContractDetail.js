import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import { Fade } from 'react-reveal';
import { Spinner } from 'react-bootstrap';
import { toast } from '../../../components/widgets/toast';

const ContractDetail = () => {
  const { contractId } = useParams();
  const [isFetching, setFetching] = useState(false);
  const [contract, setContract] = useState(null);

  useEffect(() => {
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
      <div className='mt-4'>
        {!isFetching && contract && (
          <Fade>
            <div>{JSON.stringify(contract)}</div>
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
    </>
  );
};

export default ContractDetail;
