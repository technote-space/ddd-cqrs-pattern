import initStoryshots from '@storybook/addon-storyshots';
import MockDate from 'mockdate';

beforeEach(() => {
  MockDate.set('2000-11-22');
});

afterEach(() => {
  MockDate.reset();
});
initStoryshots();
