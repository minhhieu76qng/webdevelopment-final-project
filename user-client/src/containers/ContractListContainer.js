import { connect } from 'react-redux';
import ContractList from '../components/contract/ContractList';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(ContractList);
