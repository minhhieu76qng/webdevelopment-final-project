import { connect } from 'react-redux';
import { setUser } from '../actions';
import HeaderAccount from '../components/header/HeaderAccount';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => {
      dispatch(setUser(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderAccount);
