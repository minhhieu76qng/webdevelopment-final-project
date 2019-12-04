import React from 'react';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    type='button'
    className='reset-button d-inline'
    style={{ cursor: 'pointer' }}
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

export default CustomToggle;
