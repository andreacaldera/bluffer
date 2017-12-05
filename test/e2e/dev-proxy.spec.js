import puppeteer from 'puppeteer';
import request from 'superagent';
import { find } from '../util/async';

const baseUrl = 'http://localhost:5001';

const clearLogBtnSelector = '.test-clearLog';
const responseSelector = '.test-responseList > .test-response';

const clearMocksBtnSelector = '.test-clearMocks';
const mocksSelector = '.test-mockList > .test-response';
const mockBtnSelector = '.test-mockBtn';

describe('dev proxy', () => {
  let browser;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
  });

  describe('using fake upstream server', () => {
    let page;
    let logCount;

    beforeEach(async () => {
      // load the Page
      page = await browser.newPage();
      await page.goto(`${baseUrl}`);

      // clear logged responses
      const clearLogBtn = await page.$(clearLogBtnSelector);
      if (clearLogBtn) await clearLogBtn.click();

      // clear all mocks
      const clearMocksBtn = await page.$(clearMocksBtnSelector);
      if (clearMocksBtn) await clearMocksBtn.click();
    });

    describe('when a request is made', () => {
      beforeEach(async () => {
        const res = await request.get(`${baseUrl}/api`);
        expect(res.status).toEqual(200);

        // wait for list of responses to update
        const responseCount = (await page.$$(responseSelector)).length;
        await page.waitForFunction(
          (selector, preCount) =>
            document.querySelectorAll(selector).length !== preCount,
          {},
          responseSelector,
          responseCount,
        );
      });

      it('should log responses', async () => {
        const responses = await page.$$(responseSelector);
        expect(responses).toHaveLength(1);
      });

      describe('when a mock is created', () => {
        beforeEach(async () => {
          const response = await page.$(responseSelector);
          await response.click();

          const mockBtn = await response.$(mockBtnSelector);
          mockBtn.click();
        });

        fit('should persist the mock', async () => {
          const mocks = await page.$$(mocksSelector);
          expect(mocks).toHaveLength(1);
        });

        describe('when a request is made', () => {
          it('should log respond with the mock');
        });
      });
    });

    // beforeEach(async () => {
    //   logCount = (await page.$$(responseSelector)).length;
    //
    //   const res = await request.get(`${baseUrl}/api`);
    //   expect(res.status).toEqual(200);
    // });
    //
    // it('should log responses', async () => {
    //   await page.waitForFunction(
    //     expectedCount =>
    //       document.querySelectorAll('.list-group > .mt-1').length ===
    //       expectedCount,
    //     {},
    //     logCount + 1,
    //   );
    // });

    // fdescribe('when a mock is created', async () => {
    //
    //
    //   beforeEach(async () => {
    //     const responses = await page.$$(responseSelector);
    //     const log = await find(responses, async e => {
    //       const innerText = await e.getProperty('innerText');
    //       return /\/api/.test(innerText.toString());
    //     });
    //
    //     expect(log).toBeTruthy();
    //   });
    //
    //   it('should mock a response', async () => {});
    // });
  });

  afterEach(async () => {
    console.log('closing browser');
    await browser.close();
  });
});
