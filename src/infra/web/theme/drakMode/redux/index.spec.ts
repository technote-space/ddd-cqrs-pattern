import { DarkModeContext } from '.';

describe('DarkModeContext', () => {
  const context = new DarkModeContext();

  it('key が darkMode', () => {
    expect(context.getKey()).toBe('darkMode');
  });

  it('darkMode の初期値は true', () => {
    expect(context.getInitialState()).toEqual({ darkMode: true });
  });

  it('TOGGLE_DARK_MODE で darkMode が切り替わる', () => {
    const mapper = context.getReducerMapObject();
    const store = { darkMode: true };

    expect(mapper).toHaveProperty('TOGGLE_DARK_MODE');
    expect(typeof mapper['TOGGLE_DARK_MODE']).toBe('function');
    expect(mapper['TOGGLE_DARK_MODE'](store, { type: 'TOGGLE_DARK_MODE' })).toEqual({ darkMode: false });
    expect(mapper['TOGGLE_DARK_MODE'](undefined, { type: 'TOGGLE_DARK_MODE' })).toEqual({ darkMode: true });
  });

  it('永続化の対象は darkMode', () => {
    expect(context.persistTargets()).toEqual(['darkMode']);
  });
});
