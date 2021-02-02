import * as assert from 'assert';
import {tokenizer} from '../lisp-tokenizer.js';


describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });

describe('Tokenizer NUM', function(){
    it('should detect a number token', function(){
        assert.deepEqual(tokenizer(`(1)`), ["(",{"type": "NUM","atom": "1"},")"]);
    });
});

describe('Tokenizer OPER NUM', function(){
    it('should detect an operator and number tokens', function(){
        assert.deepEqual(tokenizer(`(+ 1 2)`), [
            "(",{"type": "OPER","atom": "+"}, {"type": "NUM","atom": "1"},{"type": "NUM","atom": "2"},")"
        ]);
    });
});