module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format = 'soul://ul.soulapp.cn/account/userHomepage?bussiness=32&userId=%s';
        const util = require('util');
        const url = require('url');
        const parsedUrl = url.parse(item.replace('#', ''), true);
        const params = parsedUrl.query;
        //soul share
        const useData = item.split('soul');
        if (useData[1] && params.targetUserIdEcpt) {
            const useNum = params.targetUserIdEcpt;
            const scheme = util.format(scheme_format, useNum);
            resolve({
                scheme_link_ios: scheme,
                scheme_link_android: scheme,
                scheme_identifier: useNum,
            });
            return;
        } else {
            resolve('1')
        }
    })
}