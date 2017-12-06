import { Given as step, defineSupportCode } from 'cucumber';

import puppeteer from 'puppeteer';
import request from 'superagent';
import { lorem } from 'faker';
import assert from 'assert';

const baseUrl = 'http://localhost:5001';

const clearLogBtnSelector = '.test-clearLog';
const responseSelector = '.test-responseList > .test-response li';

const clearMocksBtnSelector = '.test-clearMocks';
// const mocksSelector = '.test-mockList > .test-response';
// const mockBtnSelector = '.test-mockBtn';

// const textareaSelector = '.test-textarea';

const randomPath = (...args) =>
  lorem
    .words(...args)
    .split(' ')
    .join('/');

defineSupportCode(({ After, Before }) => {
  Before(async function() {
    this.browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 250,
    });
    this.page = await this.browser.newPage();
  });

  After(async function() {
    const { browser, page } = this;

    await page.screenshot({
      path: 'example.png',
      fullPage: true,
    });
    await browser.close();
  });
});

step('I visit the proxy ui', async function() {
  const { page } = this;
  await page.goto(`${baseUrl}`);
});

step('I have no logged requests', async function() {
  const { page } = this;

  const clearLogBtn = await page.$(clearLogBtnSelector);
  if (clearLogBtn) await clearLogBtn.click();
});

step('I have no mocked responses', async function() {
  const { page } = this;

  const clearMocksBtn = await page.$(clearMocksBtnSelector);
  if (clearMocksBtn) await clearMocksBtn.click();
});

step('I make multiple requests to via the proxy', async function() {
  // Write code here that turns the phrase above into concrete actions
  const requestCount = Math.round(Math.random() * 10);
  this.proxyRequests = await Promise.all(
    Array(requestCount)
      .fill('')
      .map(() =>
        request.get(`${baseUrl}/api/${randomPath()}`).then(response => {
          assert(response.status === 200);
          return response;
        }),
      ),
  );
});

step('I expect to see all the requests made', async function() {
  const { page, proxyRequests } = this;

  await page.waitForSelector(responseSelector);

  const loggedResponse = await page.evaluate(
    selector => document.querySelectorAll(selector).length,
    responseSelector,
  );
  assert(loggedResponse === proxyRequests.length);
});
