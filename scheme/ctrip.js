//ctrip
module.exports = function (item, timeout) {
    const errTip = 'error'
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(errTip);
        }, timeout);
        const util = require('util');
        const axios = require('axios');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            // match URL
            const urls = text.match(urlRegex);
            return urls;
        }

        const urlGet = extractURLs(item.data);

        if (urlGet[0]) {
            const url = require('url');
            const parsedUrl = url.parse(urlGet[0], true);
            const params = parsedUrl.query;
            if (!params.s_guid || !params.clientAuth) {
                resolve(errTip);
                return;
            }
            const userData = {
                "syscode": "mkt_wakeuprules",
                "url": `https://m.ctrip.com/webapp/you/tripshoot/user/home?seo=0&clientAuth=${params.clientAuth}&isHideHeader=true&isHideNavBar=YES&type=4`,
                "disabledGuid": true,
                "needGuid": 1,
                "GUID": `AM_v20150908_${params.s_guid}`,
                "ua": "mozilla/5.0 (iphone; cpu iphone os 16_6 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/16.6 mobile/15e148 safari/604.1"
            }
            //ctrip share url
            axios.post('https://m.ctrip.com/restapi/soa2/11867/json/getUniversalLink', userData, {
                    headers: {
                        //you user-Agent
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                    }
                })
                .then((response) => {
                    if (response.data.data.transformurl) {
                        const scheme = util.format(item.scheme_service_data, response.data.data.transformurl);
                        resolve({
                            scheme_link: scheme,
                            scheme_identifier: params.clientAuth,
                        });
                        return;
                    } else {
                        resolve(errTip);
                    }
                })
                .catch(() => {
                    resolve(errTip);
                });
        }
    })
}
