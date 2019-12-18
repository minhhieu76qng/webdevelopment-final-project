import React from 'react';
import Axios from 'axios';
import toast from '../widgets/toast';
import TokenStorage from '../../utils/TokenStorage';

const FormUploadAvatar = ({ account, fetchAccount }) => {
  const handleChange = event => {
    if (event.target.files.length === 0) {
      return;
    }
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    Axios.put(`/api/user/accounts/${account._id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data',
      },
    })
      .then(({ data: { isUpdated, token } }) => {
        if (isUpdated && token) {
          toast.success('Upload new avatar successfully!');
          TokenStorage.set(token);
          fetchAccount();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  };
  return (
    <div className='custom-file'>
      <input
        style={{ display: 'none' }}
        type='file'
        name='avatar'
        id='inputGroupFile01'
        onChange={handleChange}
      />
      <label
        className='d-inline-block mt-2 btn btn-primary btn-sm'
        htmlFor='inputGroupFile01'
      >
        Upload avatar
      </label>
    </div>
  );
};

export default FormUploadAvatar;
