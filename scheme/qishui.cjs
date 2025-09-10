module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format = 'luna://luna.com/artist?artist_id=%s&user_id=%s&from_channel=&scene_name=share_awake&sub_scene_name=others&enter_app=others&from_platform=h5';
        const util = require('util');
        const axios = require('axios');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }
        //qishui share
        const urlGet = extractURLs(item);
        if (urlGet[0]) {
            axios.get(urlGet[0], {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                    }
                })
                .then((response) => {
                    const url = require('url');
                    console.log(response.request.res.responseUrl);
                    const parsedUrl = url.parse(response.request.res.responseUrl, true);
                    const params = parsedUrl.query;
                    if (params.artist_id) {
                        const scheme = util.format(scheme_format, params.artist_id, params.sec_auid?params.sec_auid:'');
                        resolve({
                            scheme_link_ios: scheme,
                            scheme_link_android: scheme,
                            scheme_identifier: params.artist_id,
                        });
                        return;
                    }else{
                    resolve('1')
                    }
                })
                .catch(() => {
                    resolve('1')
                });
        }
    })
}