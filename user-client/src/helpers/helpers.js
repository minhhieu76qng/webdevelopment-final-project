import ContractStatus from '../constance/ContractStatus';

export function getStatus(stt) {
  switch (stt) {
    case ContractStatus.pending:
      return 'warning';
    case ContractStatus.teaching:
      return 'info';
    case ContractStatus.paid:
      return 'success';
    case ContractStatus.complain:
      return 'danger';
    default:
      return null;
  }
}

export function get() {}
