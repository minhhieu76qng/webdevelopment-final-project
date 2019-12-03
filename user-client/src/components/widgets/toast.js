import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast as ToastFunc } from 'react-toastify';
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

const toastOption = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const ContentComp = ({ message, icon }) => {
  return (
    <div>
      <FontAwesomeIcon
        icon={icon}
        style={{ marginRight: 20, fontSize: 30, verticalAlign: 'middle' }}
      />
      {message}
    </div>
  );
};

export const toast = {
  success(message) {
    ToastFunc.success(
      <ContentComp message={message} icon={faCheckCircle} />,
      toastOption,
    );
  },
  info(message) {
    ToastFunc.info(
      <ContentComp message={message} icon={faInfoCircle} />,
      toastOption,
    );
  },
  error(message) {
    ToastFunc.error(
      <ContentComp message={message} icon={faTimesCircle} />,
      toastOption,
    );
  },
  warn(message) {
    ToastFunc.warn(
      <ContentComp message={message} icon={faExclamationCircle} />,
      toastOption,
    );
  },
};

export default toast;
