import { connect } from 'react-redux';
import { fetchTags, fetchCities } from '../actions';
import Filter from '../components/filter/Filter';

const mapStateToProps = state => {
  return {
    cities: state.cities,
    tags: state.tags,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTags: () => {
      dispatch(fetchTags());
    },
    fetchCities: () => {
      dispatch(fetchCities());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
