import { connect } from 'react-redux';
import { fetchAccount, setCities } from '../actions';
import FormUpdateInfo from '../components/account/FormUpdateInfo';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
    cities: state.cities,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
    setCities: () => {
      dispatch(setCities());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormUpdateInfo);
