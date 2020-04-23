import { createStore, combineReducers } from 'redux';

const INITIAL_STATE = {
	region: null,
	regions: null,
	forecast: null,
	local: null,
	mapDay: 0,
	typeView: 'tMax',
	hoverForecast: null,
	nearLocation: null,
};

function ipma(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'SET_REGION':
			return { ...state, region: action.region };
		case 'REMOVE_REGION':
			return { ...state, region: null };
		case 'SET_REGIONS':
			return { ...state, regions: action.regions };
		case 'REMOVE_REGIONS':
			return { ...state, regions: null };
		case 'SET_FORECAST':
			return { ...state, forecast: action.forecast };
		case 'REMOVE_FORECAST':
			return { ...state, forecast: null };
		case 'SET_LOCAL':
			return { ...state, local: action.local };
		case 'REMOVE_LOCAL':
			return { ...state, local: null };
		case 'SET_MAP_DAY':
			return { ...state, mapDay: action.index };
		case 'SET_TYPE':
			return { ...state, typeView: action.typeView };
		case 'SET_HOVER_FORECAST':
			return { ...state, hoverForecast: action.hover };
		case 'SET_NEAR_LOCATION':
			return { ...state, nearLocation: action.nearLocation };
		default:
			return state;
	}
}

const reducer = combineReducers({ ipma: ipma });

const store = createStore(reducer);

export default store;
