import React from 'react';
import { Table } from 'react-bootstrap';

const ContractList = () => {
  const onContractClick = () => {};
  // const onContractClick = contractId => {
  //   alert(contractId);
  // };
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <td style={{ width: '5%' }}>#</td>
            <td style={{ width: '30%' }}>Name of Contract</td>
            <td style={{ width: '20%' }}>Student</td>
            <td style={{ width: '20%' }}>Teacher</td>
            <td style={{ width: '15%' }}>Begin date</td>
            <td style={{ width: '10%' }}>Status</td>
          </tr>
        </thead>
        <tbody>
          <tr onClick={() => onContractClick(123)}>
            <td>1</td>
            <td>kfghjkg</td>
            <td>kfghjkg</td>
            <td>kfghjkg</td>
            <td>kfghjkg</td>
            <td>kfghjkg</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ContractList;
