import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import ContractList from '../../../components/contract/ContractList';
import { toast } from '../../../components/widgets/toast';

const ActiveContracts = () => {
  const [isFetching, setFetching] = useState(false);
  const [contracts, setContracts] = useState(null);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setFetching(true);
    Axios.get('/api/user/contracts/active', { limit, page })
      .then(
        ({
          data: {
            contracts: list,
            total: totalItem,
            limit: pageLimit,
            page: currentPage,
          },
        }) => {
          setContracts(list);
          setTotal(totalItem);
          setPage(currentPage);
          setLimit(pageLimit);
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
  }, [limit, page]);

  const onRowClick = () => {};
  return (
    <div>
      <ContractList
        list={contracts}
        isFetching={isFetching}
        page={page}
        total={Math.ceil(total / limit)}
        onRowClick={onRowClick}
        onPageClick={setPage}
      />
    </div>
  );
};

export default ActiveContracts;
