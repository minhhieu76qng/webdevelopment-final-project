import App from '../App';
import { fetchAccount, fetchCategories } from '../actions';
import { connect } from 'react-redux';

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

export default connect(null, mapDispatchToProps)(App);
