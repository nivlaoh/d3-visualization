import { DataVizTestPage } from './app.po';

describe('data-viz-test App', function() {
  let page: DataVizTestPage;

  beforeEach(() => {
    page = new DataVizTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
