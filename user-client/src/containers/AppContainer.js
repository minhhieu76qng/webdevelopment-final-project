import { connect } from 'react-redux';
import App from '../App';
import { fetchAccount, fetchCategories } from '../actions';

const mapDispatchToProps = dispatch => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
    fetchCategories: () => {
      dispatch(fetchCategories());
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
