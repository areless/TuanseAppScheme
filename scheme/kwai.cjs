module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);

        const scheme_format = 'kwai://profile/%s/';
        const util = require('util');
        const axios = require('axios');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }
        const urlGet = extractURLs(item);
        if (urlGet[0]) {
            axios.get(urlGet[0], {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                    }
                })
                .then((response) => {
                    const url = require('url');
                    const parsedUrl = url.parse(response.request.res.responseUrl, true);
                    const params = parsedUrl.query;
                    if (params.shareObjectId) {
                        const scheme = util.format(scheme_format, params.shareObjectId);
                        resolve({
                            scheme_link_ios: scheme,
                            scheme_link_android: scheme,
                            scheme_identifier: params.shareObjectId,
                        });
                        return;
                    }
                })
                .catch(() => {
                    resolve('1')
                });
        }
    })
}