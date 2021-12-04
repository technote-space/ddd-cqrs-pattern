import JsonwebtokenJwt from './jsonwebtokenJwt';

describe('JsonwebtokenJwt', () => {
  it('signで返った文字列のトークンがverifyでデコードされる', () => {
    const jwt = new JsonwebtokenJwt();
    const payload = { test: '123' };

    const token = jwt.sign(payload, 'secret');
    expect(typeof token).toBe('string');
    expect(token.length).not.toBe(0);

    const decoded = jwt.verify(token, 'secret');
    expect(decoded).toEqual(expect.objectContaining(payload));
  });

  describe('verify', () => {
    it('JWTエラーの場合は Unauthorized', () => {
      const jwt = new JsonwebtokenJwt();

      expect(() => jwt.verify('', '')).toThrow('Unauthorized');
    });
  });
});
