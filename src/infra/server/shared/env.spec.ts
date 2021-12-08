import Env from './env';

describe('Env', () => {
  const cached = process.env;

  beforeEach(() => {
    process.env = { ...cached };
  });

  afterAll(() => {
    process.env = cached;
  });

  const env = new Env();

  it('指定されたキーに設定された環境変数が返る', () => {
    process.env['test'] = 'abc';
    expect(env.getValue('test')).toBe('abc');
  });

  it('指定されたキーがない場合にエラー', () => {
    expect(() => env.getValue('test')).toThrow();
  });

  it('指定されたキーの値が undefined の場合にエラー', () => {
    process.env['test'] = undefined;
    expect(() => env.getValue('test')).toThrow();
  });

  it('指定されたキーがない場合でもデフォルト値が設定されていればそれが返る', () => {
    expect(env.getValue('test', 'abc')).toBe('abc');
  });

  it('指定されたキーの値が undefined の場合でもデフォルト値が設定されていればそれが返る', () => {
    process.env['test'] = undefined;
    expect(env.getValue('test', 'abc')).toBe('abc');
  });
});
