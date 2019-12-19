import React from 'react';
import Select from 'react-select';

const MySelect = ({ onChange, onBlur, ...props }) => {
  const handleChange = value => {
    onChange(props.name, value);
  };

  const handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    onBlur(props.name, true);
  };
  return (
    <>
      <Select {...props} onChange={handleChange} onBlur={handleBlur} />
      {!!props.error && props.touched && (
        <div style={{ color: 'red', marginTop: '.5rem' }}>{props.error}</div>
      )}
    </>
  );
};

MySelect.defaultProps = {
  isMulti: false,
};

export default MySelect;
