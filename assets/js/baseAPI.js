$.ajaxPrefilter((options) => {
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    options.complete = (res) => {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
});