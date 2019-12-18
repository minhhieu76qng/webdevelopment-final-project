import { connect } from 'react-redux';
import { fetchAccount } from '../actions';
import FormUploadAvatar from '../components/account/FormUploadAvatar';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormUploadAvatar);
