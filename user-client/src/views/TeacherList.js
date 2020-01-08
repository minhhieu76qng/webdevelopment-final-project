import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Accordion, Pagination } from 'react-bootstrap';
import _ from 'lodash';
import Axios from 'axios';
import shortid from 'shortid';
import TeacherCardHorizontal from '../components/card/TeacherCardHorizontal';
import { toast } from '../components/widgets/toast';
import FilterContainer from '../containers/FilterContainer';
import priceFilter from '../constance/PriceFilter';

const arrSkeleton = new Array(4).fill(0);

const sortOptions = [
  {
    value: 1,
    name: 'Default',
  },
  {
    value: 2,
    name: 'A -> Z',
  },
  {
    value: 3,
    name: 'Z -> A',
  },
];

function doSort(list = [], sortValue) {
  const temp = [...list];

  switch (sortValue) {
    case 2: // sort a - > z
      return temp.sort((a, b) => {
        const nameA = `${a.account.name.firstName} ${a.account.name.lastName}`;
        const nameB = `${b.account.name.firstName} ${b.account.name.lastName}`;
        return nameA.localeCompare(nameB);
      });
    case 3: // sort z - > a
      return temp.sort((a, b) => {
        const nameA = `${a.account.name.firstName} ${a.account.name.lastName}`;
        const nameB = `${b.account.name.firstName} ${b.account.name.lastName}`;
        return nameB.localeCompare(nameA);
      });
    default:
      return list;
  }
}

const processData = (list, filter, sort) => {
  let temp = [...list];

  list.map(teacher => {
    let isRemove = false;
    // filter by address
    if (
      _.isArray(filter.addressList) &&
      filter.addressList.length > 0 &&
      teacher.account.address &&
      teacher.account.address.city
    ) {
      isRemove = !filter.addressList.includes(teacher.account.address.city._id);
    }
    // filter by tags
    if (
      _.isArray(filter.tagList) &&
      filter.tagList.length > 0 &&
      teacher.tags
    ) {
      let isFound = false;
      for (let i = 0; i < teacher.tags.length; i += 1) {
        if (filter.tagList.includes(teacher.tags[i]._id)) {
          isFound = true;
          break;
        }
      }
      isRemove = !isFound;
    }

    // filter by price
    if (
      _.isArray(filter.priceList) &&
      filter.priceList.length > 0 &&
      _.isNumber(teacher.pricePerHour)
    ) {
      let isFound = false;
      for (let i = 0; i < filter.priceList.length; i += 1) {
        const priceItem = priceFilter.find(
          val => val.text === filter.priceList[i],
        );
        if (typeof priceItem !== 'undefined') {
          if (priceItem.to === null) {
            if (teacher.pricePerHour >= priceItem.from) {
              isFound = true;
              break;
            }
          } else if (
            teacher.pricePerHour >= priceItem.from &&
            teacher.pricePerHour < priceItem.to + 1
          ) {
            isFound = true;
            break;
          }
        }
      }

      isRemove = !isFound;
    }

    if (isRemove) {
      temp.splice(
        temp.findIndex(val => val._id === teacher._id),
        1,
      );
    }

    return 0;
  });

  // sort
  if (_.isArray(temp)) {
    temp = doSort(temp, sort);
  }
  return temp;
};

const limit = 2;

const initialFilter = {
  addressList: [],
  priceList: [],
  tagList: [],
};

const TeacherList = () => {
  // state
  const { catId } = useParams();
  const [teachers, setTeachers] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [sortValue, setSortValue] = useState(1);
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(1);

  // effect
  useEffect(() => {
    setIsFetching(true);
    Axios.get(`/api/user/teachers/cat/${catId}`)
      .then(({ data: { teachers: teachersRes } }) => {
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

  // functions
  const onSortChange = event => {
    event.persist();
    let { value } = event.target;
    value = _.toInteger(value);

    setSortValue(value);
  };

  const setFilterObject = filterObj => {
    setPage(1);
    setFilter(filterObj);
  };

  const onPageClick = pageNumber => {
    setPage(pageNumber);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  let temp = null;
  if (teachers) {
    temp = processData(teachers, filter, sortValue);
  }

  // paginate
  const paginateItems = [];
  if (_.isArray(temp)) {
    for (let i = 1; i <= Math.ceil(temp.length / limit); i += 1) {
      paginateItems.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => onPageClick(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }

    temp = temp.slice(limit * (page - 1), limit * page);
  }

  return (
    <div className='teacher-list-page shadow bg-white rounded'>
      <div className='bg-light px-3 py-3'>
        <Accordion>
          <Accordion.Toggle
            as={Button}
            size='sm'
            variant='info'
            className='mr-3 d-inline-block'
            eventKey='1'
          >
            Filters
          </Accordion.Toggle>

          <Form.Control
            className='d-inline-block'
            as='select'
            size='sm'
            name='sort'
            style={{ maxWidth: 100 }}
            onChange={onSortChange}
          >
            {sortOptions.map(op => (
              <option key={op.value} value={op.value}>
                {op.name}
              </option>
            ))}
          </Form.Control>

          <Accordion.Collapse eventKey='1'>
            <div className='pt-4'>
              <FilterContainer
                filterObject={filter}
                setFilterObject={setFilterObject}
              />
            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
      <div className='list'>
        {isFetching &&
          arrSkeleton.map(() => (
            <TeacherCardHorizontal loadding key={shortid.generate()} />
          ))}
        {!isFetching &&
          _.isArray(temp) &&
          temp.map(tch => (
            <TeacherCardHorizontal key={tch._id} teacher={tch} />
          ))}
        {!isFetching && paginateItems.length > 0 && (
          <div className='text-center mt-3'>
            <Pagination size='sm' className='d-inline-flex'>
              {paginateItems}
            </Pagination>
          </div>
        )}
        {!isFetching && _.isArray(temp) && temp.length === 0 && (
          <p className='py-3 text-center font-italic text-dark'>
            No teacher found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
