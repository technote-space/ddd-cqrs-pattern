import DueDate from './dueDate';

describe('DueDate', () => {
  it('名前が「期日」', () => {
    expect(DueDate.create('2020-01-01').getName()).toBe('期日');
  });
});
