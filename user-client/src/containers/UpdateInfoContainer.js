import { connect } from 'react-redux';
import UpdateInfo from '../views/account/profile/UpdateInfo';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(UpdateInfo);
