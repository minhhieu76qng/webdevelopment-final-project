import { connect } from 'react-redux';
import Footer from '../components/footer/Footer';

const mapStateToProps = state => {
  return {
    categories: state.categories,
  };
};

export default connect(mapStateToProps)(Footer);
