import { SET_USER, SET_CITIES, SET_CATEGORIES } from '../actions';

const initialState = {
  loggedAccount: null,
  categories: null,
  cities: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, loggedAccount: action.account };
    case SET_CITIES:
      return { ...state, cities: [...action.list] };
    case SET_CATEGORIES:
      return { ...state, categories: [...action.list] };
    default:
      return state;
  }
}
