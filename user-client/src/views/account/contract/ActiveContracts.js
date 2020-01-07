import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from '../../../components/widgets/toast';
import ContractListContainer from '../../../containers/ContractListContainer';

const ActiveContracts = () => {
  const history = useHistory();
  const [isFetching, setFetching] = useState(false);
  const [contracts, setContracts] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setFetching(true);
    const { limit, page } = pagination;
    Axios.get(`/api/user/contracts/active?limit=${limit}&page=${page}`)
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

  const onRowClick = contractId => {
    history.push(`/account/contracts/detail/${contractId}`);
  };
  return (
    <div className='active-contracts'>
      <ContractListContainer
        list={contracts}
        isFetching={isFetching}
        pagination={pagination}
        total={total}
        onRowClick={onRowClick}
        setPagination={setPagination}
      />
    </div>
  );
};

export default ActiveContracts;
