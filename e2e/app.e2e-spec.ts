import { AppMoneyPage } from './app.po';

describe('app-money App', () => {
  let page: AppMoneyPage;

  beforeEach(() => {
    page = new AppMoneyPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
