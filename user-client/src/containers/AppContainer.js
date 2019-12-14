import App from '../App';
import { fetchAccount } from '../actions';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
