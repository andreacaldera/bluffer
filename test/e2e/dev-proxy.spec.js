import puppeteer from 'puppeteer';
import request from 'superagent';

const baseUrl = 'http://localhost:5001';

const clearLogBtnSelector = '.test-clearLog';
const responseSelector = '.test-responseList > .test-response li';

const clearMocksBtnSelector = '.test-clearMocks';
const mocksSelector = '.test-mockList > .test-response';
const mockBtnSelector = '.test-mockBtn';

const textareaSelector = '.test-textarea';

describe('dev proxy', () => {
  jest.setTimeout(60 * 1000);
  let browser;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: true,
      // slowMo: 250,
    });
  });

  afterEach(async () => {
    await browser.close();
  });

  describe('using fake upstream server', () => {
    let page;

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
          await page.evaluate(
            (response, textarea, mockBtn, mockData) => {
              const $response = document.querySelector(response);
              $response.click();

              const $textarea = $response.parentNode.querySelector(textarea);
              const $mockBtn = $response.parentNode.querySelector(mockBtn);

              $textarea.value = mockData;
              $mockBtn.click();
            },
            responseSelector,
            textareaSelector,
            mockBtnSelector,
            JSON.stringify({ mudi: 'was here' }),
          );
        });

        it('should persist the mock', async () => {
          const mocks = await page.$$(mocksSelector);
          expect(mocks).toHaveLength(1);
        });

        describe('when a request is made', () => {
          let res;
          beforeEach(async () => {
            res = await request.get(`${baseUrl}/api`);
            expect(res.status).toEqual(200);
          });

          it('should log respond with the mock', () => {
            expect(res.text).toEqual(JSON.stringify({ mudi: 'was here' }));
          });
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
});
