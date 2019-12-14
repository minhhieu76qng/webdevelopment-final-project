import { connect } from 'react-redux';
import UpdateInfo from '../views/account/profile/UpdateInfo';
import { fetchAccount } from '../actions';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInfo);
