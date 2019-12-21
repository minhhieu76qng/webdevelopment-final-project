import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import _ from 'lodash';
import Axios from 'axios';
import TeacherCardHorizontal from '../components/card/TeacherCardHorizontal';
import { toast } from '../components/widgets/toast';

const arrSkeleton = new Array(4).fill(0);

const TeacherList = () => {
  const { catId } = useParams();
  const [teachers, setTeachers] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    Axios.get(`/api/user/teachers/cat/${catId}`)
      .then(({ data: { teacher: teachersRes } }) => {
        setTeachers(teachersRes);
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error);
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [catId]);

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
          <option>A -&gt; Z</option>
          <option>Z -&gt; A</option>
        </Form.Control>
      </div>
      <div className='list'>
        {isFetching &&
          arrSkeleton.map(() => <TeacherCardHorizontal loadding />)}
        {!isFetching &&
          _.isArray(teachers) &&
          teachers.map(tch => <TeacherCardHorizontal teacher={tch} />)}
        {/* no teacher */}
      </div>
    </div>
  );
};

export default TeacherList;
