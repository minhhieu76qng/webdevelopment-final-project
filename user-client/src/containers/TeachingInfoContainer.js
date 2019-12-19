import { connect } from 'react-redux';
import TeachingInfo from '../views/account/profile/TeachingInfo';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(TeachingInfo);
