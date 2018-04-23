import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ROLE_LIST':
			return 'LIST';
		case 'START_ADD_ROLE':
		case 'SET_ROLE_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_ROLE':
		case 'SET_ROLE_EDIT_DATA':
			return {};
		case 'SET_ROLE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state || null;
	}
}

const defaultDataItem = {
	name: '',
	is_active: '',
	rolepermissions: {}
}

function item(state = defaultDataItem, action) {
	switch(action.type) {
		case 'START_ADD_ROLE':
			return {
				name: '',
				is_active: '',
				rolepermissions: {}
			};
		case 'SET_ROLE_EDIT_DATA':
			return {
				id: action.data.data.id,
				name: action.data.data.roledetails[0].name,
				detailId: action.data.data.roledetails[0].id,
				rolepermissions:rolePermissions(action.data.data.rolepermissions),
				is_active: action.data.data.is_active
			};
		case 'UPDATE_ROLE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		case 'UPDATE_ROLE_PERMISSIONS':
			let newPR = {...state};
				newPR.rolepermissions[action.model] = action.permissions;
			return newPR;
		default:
			return state;
	}
}

function rolePermissions(value) {
	var permissionRoleIdsArr = {};
	value.forEach(function(val) {
		if(permissionRoleIdsArr[val.module_name]) {
			permissionRoleIdsArr[val.module_name].push(val.permissionId);
		} else {
			permissionRoleIdsArr[val.module_name] = [val.permissionId];
		}
	});
	return permissionRoleIdsArr;
}

const defaultHelperData = {
	permissions: [],
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD_ROLE':
		case 'SET_ROLE_EDIT_DATA':
			var permissions = []
			if(action.userId == 1){
				permissions = makePermissionsSuperadmin(action.data.permissions)
			} else {
				permissions = makePermissions(action.data.permissions)
			}
			return {
				permissions: permissions
			};
		default:
			return state;
	}
}

function makePermissionsSuperadmin(permissions){
	var modules = [], modulesCheck = [];
	permissions.forEach(function(item){
		if(modulesCheck.indexOf(item.model) < 0){
			var actions = [];
			permissions.forEach(function(item2){
				if(item.model == item2.model){
					var action = {};
					action.id = item2.id;
					action.action = item2.action;
					action.name = item2.permissiondetails[0].name

					actions.push(action);
				}
			});
			var modulesObj = {};
			modulesObj.model = item.model;
			modulesObj[item.model] = actions;
			modules.push(modulesObj);
			modulesCheck.push(item.model);
		}
	});
	return modules;
}

function makePermissions(permissions){
	var modules = [], modulesCheck = [];
	permissions.forEach(function(item){
		if(modulesCheck.indexOf(item.permission.model) < 0){
			var actions = [];
			permissions.forEach(function(item2){
				if(item.permission.model == item2.permission.model){
					var action = {};
					action.id = item2.permission.id;
					action.action = item2.permission.action;
					action.name = item2.permission.permissiondetails[0].name

					actions.push(action);
				}
			});
			var modulesObj = {};
			modulesObj.model = item.permission.model;
			modulesObj[item.permission.model] = actions;
			modules.push(modulesObj);
			modulesCheck.push(item.permission.model);
		}
	});
	return modules;
}

const reducer = combineReducers({
	viewState,
	items,
	errors,
	pageInfo,
	filter,
	item,
	helperData
});

export default reducer;