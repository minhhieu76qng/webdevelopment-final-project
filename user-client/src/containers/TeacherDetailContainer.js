import { connect } from 'react-redux';
import TeacherDetail from '../views/TeacherDetail';

const mapStateToProps = state => {
  return {
    account: state.loggedAccount,
  };
};

export default connect(mapStateToProps)(TeacherDetail);
