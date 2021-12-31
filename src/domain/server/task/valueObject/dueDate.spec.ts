import DueDate from './dueDate';

describe('DueDate', () => {
  it('ラベルが「期日」', () => {
    expect(DueDate.getLabel()).toBe('期日');
  });
});
