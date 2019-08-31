import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  it('should navigate to login page', () => {
    browser.get('/login');
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/login');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
