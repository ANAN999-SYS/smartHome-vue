import request from '../utils/axios';
//import response from '../utils/axios';

//用户登录
export const userLogin = (query) => {
    return request({
        url: '/adminLogin/Login',
        method: "post",
        headers:{},
        data: query
    });
};
//获取设备信息
export const getDevicesAll = query => {
    return request({
        url: '/Devices/getDevicesAll',
        method: 'get',
        params: query
    });
};
export const deleteDevice = query => {
    return request({
        url: '/Devices/deleteDevice',
        method: 'post',
        data: query
    });
};
export const deleteDevices = query => {
    return request({
        url: '/Devices/deleteDevices',
        method: 'post',
        data: query
    });
};

//获取情景信息
export const getScenarioAll = query => {
    return request({
        url: '/Scenario/getScenarioAll',
        method: 'get',
        params: query
    });
};
export const deleteScenarioData = query => {
    return request({
        url: '/Scenario/deleteScenarioData',
        method: 'post',
        data: query
    });
};
export const deleteScenarios = query => {
    return request({
        url: '/Scenario/deleteScenarios',
        method: 'post',
        data: query
    });
};
//获取房间信息
export const getRoomAll = query => {
    return request({
        url: '/Room/getRoomAll',
        method: 'get',
        params: query
    });
};
export const deleteRoomData = query => {
    return request({
        url: '/Room/deleteRoomData',
        method: 'post',
        data: query
    });
};
export const deleteRooms = query => {
    return request({
        url: '/Room/deleteRooms',
        method: 'post',
        data: query
    });
};

export const getRecordAll = query => {
    return request({
        url: '/Record/getRecordAll',
        method: 'get',
        params: query
    });
};
export const deleteRecordData = query => {
    return request({
        url: '/Record/deleteRecordData',
        method: 'post',
        data: query
    });
};
export const deleteRecords = query => {
    return request({
        url: '/Record/deleteRecords',
        method: 'post',
        data: query
    });
};

export const getFeedbackAll = query => {
    return request({
        url: '/Feedback/getFeedbackAll',
        method: 'get',
        params: query
    });
};
export const deleteFeedbackData = query => {
    return request({
        url: '/Feedback/deleteFeedbackData',
        method: 'post',
        data: query
    });
};
export const deleteFeedbacks = query => {
    return request({
        url: '/Feedback/deleteFeedbacks',
        method: 'post',
        data: query
    });
};
export const checkFeedbacks = query => {
    return request({
        url: '/Feedback/checkFeedbacks',
        method: 'post',
        data: query
    });
};

export const getUserAll = query => {
    return request({
        url: '/weixin/getUserAll',
        method: 'get',
        params: query
    });
};
export const editPermissions = query => {
    return request({
        url: '/weixin/editPermissions',
        method: 'post',
        data: query
    });
};
//图片上传
//{"code": ,"message":"","data":url}
export const uploadImg = query => {
    return request({
        url: '/adminLogin/uploadImg',
        method: 'post',
        data: query
    });
};

export const getAdminALl = query => {
    return request({
        url: '/adminLogin/getAdminALl',
        method: 'get',
        params: query
    });
};
export const deleteAdmin = query => {
    return request({
        url: '/adminLogin/deleteAdmin',
        method: 'post',
        data: query
    });
};
export const deleteAdmins = query => {
    return request({
        url: '/adminLogin/deleteAdmins',
        method: 'post',
        data: query
    });
};
export const permissionsAdmins = query => {
    return request({
        url: '/adminLogin/permissionsAdmins',
        method: 'post',
        data: query
    });
};
export const addAdmin = query => {
    return request({
        url: '/adminLogin/permissionsAdmins',
        method: 'post',
        data: query
    });
};
export const getAnalyseCard = query => {
    return request({
        url: '/Analyse/getAnalyseCard',
        method: 'get',
        data: query
    });
};
export const getDevicePie = query => {
    return request({
        url: '/Analyse/getDevicePie',
        method: 'get',
        data: query
    });
};

export const getActiveUser = query => {
    return request({
        url: '/Analyse/getActiveUser',
        method: 'get',
        data: query
    });
};
export const getTimePeriod = query => {
    return request({
        url: '/Analyse/getTimePeriod',
        method: 'get',
        data: query
    });
};
export const getDeviceLine = query => {
    return request({
        url: '/Analyse/getDeviceLine',
        method: 'get',
        data: query
    });
};
