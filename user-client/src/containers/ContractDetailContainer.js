import { connect } from 'react-redux';
import ContractDetail from '../views/account/contract/ContractDetail';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(ContractDetail);
