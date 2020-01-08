import { connect } from 'react-redux';
import { fetchAccount } from '../actions';
import Login from '../views/Login';

const mapDispatchToProps = dispatch => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount(null));
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);
