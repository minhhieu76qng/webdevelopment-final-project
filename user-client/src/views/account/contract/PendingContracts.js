import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { toast } from '../../../components/widgets/toast';
import ROLE from '../../../constance/Role';
import CtrNameModal from '../../../components/contract/ModalSetContractName';
import ContractListContainer from '../../../containers/ContractListContainer';

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

  const [showNamePanel, setShowNamePanel] = useState(false);

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

    // hiển thị panel nhập các tên
    setShowNamePanel(true);
  };

  const sendContractsToServer = list => {
    Axios.put('/api/user/contracts/accept', {
      contractList: list,
      acceptedDate: new Date(),
    })
      .then(({ data: { isUpdated, nModified } }) => {
        if (isUpdated && nModified >= 0) {
          toast.success(`Update ${nModified}/${list.length} items.`);
          fetchPending();
        }
      })
      .catch(err => {
        if (err && err.response && err.response.data.error) {
          toast.error(err.response.data.error.msg);
        }
      });
  };

  const setNames = values => {
    const keys = Object.keys(values);
    const tmp = keys.map(k => ({ contractId: k, name: values[k] }));
    sendContractsToServer(tmp);
    setShowNamePanel(false);
  };

  return (
    <>
      <div className='btn-blocks'>
        <Button size='sm' variant='info' onClick={() => setSelectMode(s => !s)}>
          {selectMode ? 'Cancel' : 'Select'}
        </Button>
        {selectMode && (
          <>
            {account &&
              account.role === ROLE.teacher &&
              _.isArray(selectedItems) &&
              selectedItems.length > 0 && (
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

            {account &&
              account.role === ROLE.student &&
              _.isArray(selectedItems) &&
              selectedItems.length > 0 && (
                <Button size='sm' variant='danger'>
                  <FontAwesomeIcon className='mr-2' icon={faTrash} />
                  Delete
                </Button>
              )}
          </>
        )}
      </div>
      <div className='mt-4'>
        <ContractListContainer
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

      <CtrNameModal
        account={account}
        selectedItems={selectedItems}
        show={showNamePanel}
        setShow={setShowNamePanel}
        onSubmit={setNames}
      />
    </>
  );
};

export default PendingContracts;
