import { UnavailablePipe } from './unavailable.pipe';

describe('UnavailablePipe', () => {
  let pipe: UnavailablePipe;

  beforeEach(() => {
    pipe = new UnavailablePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the value passed to it', () => {
    const out = pipe.transform('in');

    expect(out).toEqual('in');
  });

  it('should return unavailable for no value', () => {
    const out = pipe.transform(undefined);

    expect(out).toEqual('unavailable');
  });
});
