import { connect } from 'react-redux';
import PendingContracts from '../views/account/contract/PendingContracts';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(PendingContracts);
