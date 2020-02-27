import {sum} from '../../lib';
import * as assert from 'assert';
describe('Demo', function() {
  describe('sum()', function() {
    it('should return 20', () => {
      assert.equal(sum(10, 10), 20);
    });
  });
});
