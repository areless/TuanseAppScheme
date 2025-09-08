module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format = 'xhsdiscover://user/%s?exp_groups=h5_yamcha_new&open_url=%2Fuser%2Fprofile%2F%s%3Fxsec_token%3D%s%26xsec_source%3Dapp_share%26xhsshare%3DCopyLink';
        const util = require('util');
        const url = require('url');
        const parsedUrl = url.parse(item, true);
        const params = parsedUrl.query;
        const useData = item.split('xiaohongshu.com/user/profile/');
        if (useData[1] && params.xsec_token) {
            const useNum = useData[1].split('?')[0];
            const scheme = util.format(scheme_format, useNum, useNum, params.xsec_token);
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