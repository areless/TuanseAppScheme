module.exports = function (item,timeout) {
  return new Promise((resolve, reject) => {
              setTimeout(() => {
              resolve('1');
            }, timeout);
    const util = require('util');
    const scheme_format = 'openApp.jdmobile://virtual?params=%7B%22des%22%3A%22getCoupon%22%2C%22url%22%3A%22https%3A%2F%2Fshop.m.jd.com%2Fshop%2Fhome%3FshopId%3D%s%22%2C%22category%22%3A%22jump%22%7D';
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
            if (params.shopId) {
              const useNum = params.shopId;
              const scheme = util.format(scheme_format, params.shopId);
              resolve({
                    scheme_link_ios: scheme,
                    scheme_link_android: scheme,
                    scheme_ientifiedr: useNum,
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
