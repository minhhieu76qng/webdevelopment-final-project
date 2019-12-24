import React, { useEffect } from 'react';
import _ from 'lodash';
import { Row, Col, Form, Button } from 'react-bootstrap';
import priceFilter from '../../constance/PriceFilter';

const pricePerHourOptions = priceFilter.map(val => {
  return {
    name: `${val.text} USD`,
    value: val.text,
  };
});

const Filter = ({
  cities,
  tags,
  fetchCities,
  fetchTags,
  filterObject,
  setFilterObject,
}) => {
  useEffect(() => {
    fetchCities();
    fetchTags();
  }, [fetchCities, fetchTags]);

  const addressCheck = event => {
    event.persist();
    const { id, checked } = event.target;

    let addressList = [...filterObject.addressList];
    if (checked) {
      addressList.push(id);
    } else {
      addressList = addressList.filter(val => val !== id);
    }

    setFilterObject({ ...filterObject, addressList });
  };

  const tagCheck = event => {
    event.persist();
    const { id, checked } = event.target;

    let tagList = [...filterObject.tagList];
    if (checked) {
      tagList.push(id);
    } else {
      tagList = tagList.filter(val => val !== id);
    }

    setFilterObject({ ...filterObject, tagList });
  };

  const priceCheck = event => {
    event.persist();
    const { id, checked } = event.target;

    let priceList = [...filterObject.priceList];
    if (checked) {
      priceList.push(id);
    } else {
      priceList = priceList.filter(val => val !== id);
    }

    setFilterObject({ ...filterObject, priceList });
  };

  const onClearClick = () => {
    setFilterObject({
      addressList: [],
      tagList: [],
      priceList: [],
    });
  };
  return (
    <>
      <div>
        <Button variant='danger' size='sm' onClick={onClearClick}>
          Clear
        </Button>
      </div>
      <Row className='mt-2'>
        <Col xs={4} md={4}>
          <div>
            <p className='font-weight-bold' style={{ fontSize: 18 }}>
              Address:
            </p>
            {cities &&
              _.isArray(cities) &&
              cities.map(city => (
                <Form.Check
                  key={city._id}
                  id={city._id}
                  custom
                  type='checkbox'
                  label={city.name}
                  onChange={addressCheck}
                  checked={filterObject.addressList.indexOf(city._id) !== -1}
                />
              ))}
          </div>
        </Col>
        <Col xs={4} md={4}>
          <div>
            <p className='font-weight-bold' style={{ fontSize: 18 }}>
              Tags:
            </p>
            {tags &&
              _.isArray(tags) &&
              tags.map(tag => (
                <Form.Check
                  key={tag._id}
                  id={tag._id}
                  custom
                  type='checkbox'
                  label={tag.name}
                  onChange={tagCheck}
                  checked={filterObject.tagList.indexOf(tag._id) !== -1}
                />
              ))}
          </div>
        </Col>
        <Col xs={4} md={4}>
          <div>
            <p className='font-weight-bold' style={{ fontSize: 18 }}>
              Price per hour:
            </p>
            {pricePerHourOptions &&
              _.isArray(pricePerHourOptions) &&
              pricePerHourOptions.map(price => (
                <Form.Check
                  key={price.value}
                  id={price.value}
                  custom
                  type='checkbox'
                  label={price.name}
                  onChange={priceCheck}
                  checked={filterObject.priceList.indexOf(price.value) !== -1}
                />
              ))}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Filter;
