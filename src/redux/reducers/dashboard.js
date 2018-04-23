import {combineReducers} from 'redux';
const defaultInfo = {
	totalDoctors: 0,
	totalHospital: 0,
	totalPatient: 0,
	totalLiveDoctors: 0,
	totalLiveHospital: 0,
	totalUsers: 0
};
function info(state = defaultInfo, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalDoctors: action.data.totalDoctors,
				totalHospital: action.data.totalHospital,
				totalPatient: action.data.totalPatient,
				totalLiveDoctors: action.data.totalLiveDoctors,
				totalLiveHospital: action.data.totalLiveHospital,
				totalUsers: action.data.totalUsers
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	info
});

export default reducer;