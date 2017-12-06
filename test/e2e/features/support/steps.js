import { Given as step, defineSupportCode } from 'cucumber';

import puppeteer from 'puppeteer';
import request from 'superagent';
import { lorem } from 'faker';
import assert from 'assert';
import { URL } from 'url';

const baseUrl = 'http://localhost:5001';
const baseApiUrl = 'http://localhost:5002';

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
      headless: true,
      // slowMo: 250,
    });
    this.page = await this.browser.newPage();
    // this.page.on('console', msg =>
    //   console.log('PAGE LOG:', ...msg.args.map(a => a.toString())),
    // );
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
  const { page } = this;
  const requestCount = Math.round(Math.random() * 10);
  this.proxyRequests = await Promise.all(
    Array(requestCount)
      .fill('')
      .map(() =>
        request.get(`${baseApiUrl}/api/${randomPath()}`).then(response => {
          assert(response.status === 200);
          return response;
        }),
      ),
  );

  await page.waitForSelector(responseSelector);
});

step('I expect to see all the requests made', async function() {
  const { page, proxyRequests } = this;
  const loggedResponse = await page.evaluate(
    selector => document.querySelectorAll(selector).length,
    responseSelector,
  );
  assert(loggedResponse === proxyRequests.length);
});

step('I click to select any one', async function() {
  const { page, proxyRequests } = this;
  const idx = Math.round(Math.random() * proxyRequests.length);
  const response = proxyRequests[idx];
  const url = new URL(response.request.url);

  const $log = await page.evaluateHandle(
    (selector, i, pathname) => {
      const $l = document.querySelectorAll(selector)[i];
      if ($l.innerText.indexOf(pathname)) {
        $l.click();
        return $log;
      }
    },
    responseSelector,
    idx,
    url.pathname,
  );

  assert(!!$log);

  this.$log = $log;
  this.selectedResponse = response;
});

step('I should see the response body in a textarea', async function() {
  const { page, selectedResponse, $log } = this;
  const pathname = new URL(selectedResponse.request.url).pathname;
  const text = await page.evaluate($l => $l.innerText, $log);

  // console.log({ text, pathname });
  assert(text.indexOf(pathname) > -1);
});
