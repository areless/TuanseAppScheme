module.exports = function (item, timeout, chromePath) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format = 'dewulink://m.dewu.com/note?routerUrl=https%3A%2F%2Fm.poizon.com%2Frouter%2Ftrend%2FUserHomePage%3FuserId%3D%s%26shareId%3D%s%26source%3D%s%26user_id%3D%s%26isSecret%3D%s';
        const util = require('util');
        const puppeteer = require('puppeteer');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }
        async function interceptRequests() {
            //dewu share link
            let dewuUid = '';
            const browser = await puppeteer.launch({
                headless: true,
                pipe: true,
                ...(item.path ? {
                    executablePath: item.path
                } : {}),
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();
            page.setDefaultTimeout(9000);
            page.on('console', async msg => {
                if (msg.text().indexOf('link props') != -1) {
                    msg.args()[1].jsonValue().then(res => {
                        if (res.params.userId && res.params.shareId && !dewuUid) {
                            dewuUid = res.params.user_id;
                            const scheme = util.format(scheme_format, res.params.userId, res.params.shareId, res.params.source, res.params.user_id, res.params.isSecret ? 'true' : 'false');
                            resolve({
                                scheme_link_ios: scheme,
                                scheme_link_android: scheme,
                                scheme_identifier: dewuUid,
                            });
                            return;
                        }
                    })
                }
            });
            await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");

            const urlGet = extractURLs(item.data);
            await page.goto(urlGet[0]);
            await browser.close();
        }

        interceptRequests();

    })
}