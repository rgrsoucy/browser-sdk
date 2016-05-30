import expect from 'expect';
import Relayr from '../src/main';

describe('Main', () => {
  describe('can be instantiated', () => {
    it('should be a constructor', () => {
    	expect(new Relayr).toBeA(Relayr);
    });
  });
});
