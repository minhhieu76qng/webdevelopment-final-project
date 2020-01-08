import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ErrorPage = ({
  children,
  description = null,
  title = 'Submission Failed',
}) => {
  return (
    <div style={{ padding: '40px 0' }}>
      <div className='mb-3'>
        <FontAwesomeIcon
          style={{ fontSize: 90 }}
          color='red'
          icon={faTimesCircle}
        />
      </div>
      <h3 className='mb-2'>{title}</h3>
      {description && <p className='text-monospace text-dark'>{description}</p>}
      {children}
      <Link
        to='/'
        className='text-white text-decoration-none btn btn-primary btn-sm'
      >
        Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
