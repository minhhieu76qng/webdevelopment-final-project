import { connect } from 'react-redux';
import Welcome from '../views/account/Welcome';
import {
  fetchCities,
  fetchCategories,
  fetchTags,
  fetchAccount,
} from '../actions';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
    categories: state.categories,
    cities: state.cities,
    tags: state.tags,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCities: () => {
      dispatch(fetchCities());
    },
    fetchCategories: () => {
      dispatch(fetchCategories());
    },
    fetchTags: () => {
      dispatch(fetchTags());
    },
    fetchAccount: () => {
      dispatch(fetchAccount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
