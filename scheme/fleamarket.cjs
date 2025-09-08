module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const util = require('util');
        const puppeteer = require('puppeteer');
        const scheme_format = 'fleamarket://personalPage?userid=%s';

        const extractURLs = (text) => {
            // 定义一个正则表达式来匹配URL
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            // 使用match方法找到所有匹配的URL
            const urls = text.match(urlRegex);
            return urls;
        }
        const urlGet = extractURLs(item.data);
        async function interceptRequests() {
            let fleamarketUid = '';
            const browser = await puppeteer.launch({
                headless: true,
                ...(item.path ? {
                    executablePath: item.path
                } : {}),
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();
            page.setDefaultTimeout(9000);

            await page.setRequestInterception(true);
            page.on('request', request => {
                request.continue();
            });

            page.on('response', async (response) => {
                const request = response.request();
                defUrl = request.url();
                if (defUrl.indexOf('mtop.idle.web.user.page.head') != -1) {
                    const responseBody = await response.json();
                    if (responseBody.data.baseInfo) {
                        fleamarketUid = responseBody.data.baseInfo.kcUserId
                        browser.close();
                        if (fleamarketUid) {
                            const scheme = util.format(scheme_format, fleamarketUid);
                            resolve({
                                scheme_link_ios: scheme,
                                scheme_link_android: scheme,
                                scheme_identifier: fleamarketUid,
                            });
                            return;
                        } else {
                            resolve('1')
                        }
                    }
                }
            });
            await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");
            await page.goto(urlGet[0]);
        }


        interceptRequests();

    })
}