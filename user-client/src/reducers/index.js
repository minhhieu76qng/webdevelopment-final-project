import { SET_USER } from '../actions';

const initialState = {
  loggedAccount: null,
  categories: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, loggedAccount: action.account };
    default:
      return state;
  }
}
