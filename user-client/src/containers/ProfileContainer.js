import { connect } from 'react-redux';
import Profile from '../views/account/profile';
import { fetchCities } from '../actions';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCities: () => {
      dispatch(fetchCities());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
