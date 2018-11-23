
let user = '';

/**
 * 后台接口地址
 */
let baseUrl = '/api';
let socketIOUrl = 'http://192.168.11.193:9092';

if(user == 'cyz') {
    baseUrl = 'http://192.168.11.193:8080/api';
    socketIOUrl = 'http://192.168.11.193:9092';
}else if(user == 'ch') {
    baseUrl = 'http://192.168.11.184:8080/api';
}else if(user == '226') {
    baseUrl = 'http://123.57.206.226:8080/api';
}else if(user == 'yang') {
    baseUrl = 'http://192.168.11.178:8080/api';
}else if(user == 'kang') {
    baseUrl = 'http://192.168.11.133:8080/api';
}
