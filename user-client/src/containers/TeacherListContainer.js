import { connect } from 'react-redux';
import TeacherList from '../views/TeacherList';
import { fetchTags, fetchCities } from '../actions';

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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherList);
