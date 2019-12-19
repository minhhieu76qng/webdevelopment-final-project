import { connect } from 'react-redux';
import HeaderComp from '../components/header/Header';
import { setUser } from '../actions';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
    categories: state.categories,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => {
      dispatch(setUser(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComp);
