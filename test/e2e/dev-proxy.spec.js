import puppeteer from 'puppeteer';
import request from 'superagent';

let browser;

const baseUrl = 'http://localhost:5001';

const responseLogSelector = '.list-group';
const responseSelector = '.list-group > .mt-1';

describe('dev proxy', () => {
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      // slowMo: 250
    });
  });

  it('should log responses', async () => {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}`);

    await page.waitForSelector(responseLogSelector);
    const logCount = (await page.$$(responseSelector)).length;

    const res = await request.get(`${baseUrl}/api`);
    expect(res.status).toEqual(200);

    await page.waitForFunction(
      expectedCount =>
        document.querySelectorAll('.list-group > .mt-1').length ===
        expectedCount,
      {},
      logCount + 1,
    );
  });

  afterEach(async () => {
    await browser.close();
  });
});
