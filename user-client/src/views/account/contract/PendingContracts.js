import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import ContractList from '../../../components/contract/ContractList';
import { toast } from '../../../components/widgets/toast';
import ROLE from '../../../constance/Role';

const PendingContracts = ({ account }) => {
  const [isFetching, setFetching] = useState(false);
  const [contracts, setContracts] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [total, setTotal] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchPending = useCallback(() => {
    setFetching(true);
    setSelectedItems([]);
    const { limit, page } = pagination;
    Axios.get(`/api/user/contracts/pending?limit=${limit}&page=${page}`)
      .then(
        ({
          data: {
            contracts: list,
            total: totalItem,
            limit: pageLimit,
            page: currentPage,
          },
        }) => {
          if (
            pageLimit !== pagination.limit &&
            currentPage !== pagination.page
          ) {
            setPagination({
              ...pagination,
              page: currentPage,
              limit: pageLimit,
            });
          }
          setTotal(totalItem);
          setContracts(list);
        },
      )
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [pagination]);

  useEffect(() => {
    fetchPending();
  }, [pagination, fetchPending]);

  const onRowClick = () => {};

  const onAcceptClick = () => {
    if (!(_.isArray(selectedItems) && selectedItems.length > 0)) {
      toast.info(
        'You must specify a contract number before performing this action.',
      );
      return;
    }
    Axios.put('/api/user/contracts/accept', {
      contractList: selectedItems,
      acceptedDate: new Date(),
    })
      .then(({ data: { isUpdated } }) => {
        if (isUpdated) {
          toast.success('Update successfully!');
          fetchPending();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  };

  return (
    <>
      <div className='btn-blocks'>
        <Button size='sm' variant='info' onClick={() => setSelectMode(s => !s)}>
          {selectMode ? 'Cancel' : 'Select'}
        </Button>
        {selectMode && (
          <>
            {account && account.role === ROLE.teacher && (
              <>
                <Button size='sm' variant='success' onClick={onAcceptClick}>
                  <FontAwesomeIcon className='mr-2' icon={faCheck} />
                  Accept
                </Button>
                <Button size='sm' variant='danger'>
                  <FontAwesomeIcon className='mr-2' icon={faBan} />
                  Reject
                </Button>
              </>
            )}

            {account && account.role === ROLE.student && (
              <Button size='sm' variant='danger'>
                <FontAwesomeIcon className='mr-2' icon={faTrash} />
                Delete
              </Button>
            )}
          </>
        )}
      </div>
      <div className='mt-4'>
        <ContractList
          list={contracts}
          isFetching={isFetching}
          pagination={pagination}
          total={total}
          onRowClick={onRowClick}
          setPagination={setPagination}
          selectMode={selectMode}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </>
  );
};

export default PendingContracts;
