module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format_android = 'vnd.youtube://www.youtube.com/@%s/';
        const scheme_format_ios = 'youtube://www.youtube.com/@%s/';


        const util = require('util');
        //根据youtube分享链接
        const useData = item.split('youtube.com/@');
        if (useData[1]) {
            const useNum = useData[1].split('?')[0];
            const scheme_ios = util.format(scheme_format_ios, useNum);
            const scheme_android = util.format(scheme_format_android, useNum);
            resolve({
                scheme_link_ios: scheme_ios,
                scheme_link_android: scheme_android,
                scheme_identifier: useNum,
            });
            return;
        } else {
            resolve('1')
        }
    })
}