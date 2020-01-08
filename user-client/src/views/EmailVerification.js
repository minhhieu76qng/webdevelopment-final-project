import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Fade } from 'react-reveal';
import { toast } from '../components/widgets/toast';
import ErrorPage from '../components/error/ErrorPage';

const EmailVerification = () => {
  const { token } = useParams();
  const history = useHistory();
  const [isFetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setFetching(true);
    Axios.put(`/api/user/auth/confirm-email?token=${token}`)
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Account has been verified.');
          history.push('/login');
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
          setError(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [history, token]);
  return (
    <div className='py-3 px-3 bg-white rounded shadow-lg'>
      <div className='text-center'>
        {isFetching && (
          <div className='d-flex justify-content-center flex-column'>
            <div>
              <Spinner animation='border' variant='primary' />
            </div>
            <p className='mb-0 mt-3'>Email confirming...</p>
          </div>
        )}
        {!isFetching && error && (
          <Fade>
            <ErrorPage description={error} />
          </Fade>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
