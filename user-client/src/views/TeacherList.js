import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const TeacherList = () => {
  const { catId } = useParams();
  return (
    <div className='teacher-list-page shadow bg-white rounded'>
      <div className='d-flex filter-sort-wrapper bg-light px-3 py-3'>
        <Button size='sm' variant='info' className='mr-3'>
          Filters
        </Button>
        {/* <Form>
        </Form> */}
        <Form.Control
          as='select'
          size='sm'
          name='sort'
          style={{ maxWidth: 100 }}
        >
          <option>asgf</option>
          <option>asfdjk hskhdf kjsh khsdghsgf</option>
          <option>asgf</option>
          <option>asgf</option>
        </Form.Control>
      </div>
      <div className='list'>{catId}</div>
    </div>
  );
};

export default TeacherList;
