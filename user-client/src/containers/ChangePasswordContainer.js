import { connect } from 'react-redux';
import ChangePassword from '../views/account/profile/ChangePassword';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(ChangePassword);
