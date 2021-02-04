import * as assert from 'assert';
import {tokenizer, execute} from '../jayEl.js';

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


describe('Tokenizer OPER NUM', function(){
  it('should detect a string and numbers', function(){
      assert.deepEqual(tokenizer(`("a string" 1 2)`), [
          "(",{"type": "STR","atom": "a string"}, {"type": "NUM","atom": "1"},{"type": "NUM","atom": "2"},")"
      ]);
  });
});

describe('Tokenizer KEY NUM STRING', function(){
  it('should detect a keyword a string and numbers', function(){
      assert.deepEqual(tokenizer(`(car "a string" 1 2)`), [
          "(",{"type": "KEY","atom": "car"},{"type": "STR","atom": "a string"}, {"type": "NUM","atom": "1"},{"type": "NUM","atom": "2"},")"
      ]);
  });
});

describe('Tokenizer NUM KEY IND', function(){
  it('should detect a keyword an IND and NUM', function(){
      assert.deepEqual(tokenizer(`(let foo 8)`), [
          "(",{"type": "KEY","atom": "let"},{"type": "IND","atom": "foo"}, {"type": "NUM","atom": "8"},")"
      ]);
  });
});

describe('Tokenizer def', function(){
  it('should detect a keyword an IND and NUM', function(){
      assert.deepEqual(tokenizer(`(def add(a b)(+ a b))`), [
          "(",{"type": "KEY","atom": "def"},{"type": "IND","atom": "add"},"(",{"type": "IND","atom": "a"},{"type": "IND","atom": "b"},")", 
          "(",{"type": "OPER","atom": "+"}, {"type": "IND","atom": "a"},{"type": "IND","atom": "b"},")",")"
      ]);
  });
});


describe('Addition', function(){
  it('add numbers', function(){
      assert.equal(execute(`(+ 1 2 4)`), 7);
  });
});

describe('Subtraction', function(){
  it('subtract numbers', function(){
      assert.equal(execute(`(- 10 3 2)`), 5);
  });
});

describe('Multiply', function(){
  it('multiply numbers', function(){
      assert.equal(execute(`(* 10 3 2)`), 60);
  });
});

describe('Multiple Calculations', function(){
  it('several operations', function(){
      assert.equal(execute(`(+ (* 10 3 2) (+ 3 5 8) (- 8 4)`), 80);
  });
});

describe('Division', function(){
  it('should divide numbers', function(){
      assert.equal(execute(`(/ 9 3 2)`), 1.5);
  });
});


describe('Modulo', function(){
  it('should give back remainder of division', function(){
      assert.equal(execute(`(% 9 4)`), 1);
  });
});


describe('car command', function(){
  it('should return first element of list', function(){
      assert.equal(execute(`(2 4 5 4 3)`), 2);
  });
});

describe('cdr command', function(){
  it('should remove first element of list', function(){
      assert.deepEqual(execute(`(2 4 5 4 3)`), [4, 5, 4, 3]);
  });
});
// testCode('Addition',`(+ 1 2 4)`,7);
// testCode('Subtraction',`(- 10 3 2)`,5);
// testCode('Multiply',`(* 10 3 2)`,60);
// testCode('Multiple Calculations',`(+ (* 10 3 2) (+ 3 5 8) (- 8 4)`,80);
// testCode('Division',`(/ 9 3 2)`,1.5);
// testCode('Modulo',`(% 9 4)`,1);
// testCode('say command', `(say "Hello World")`, "Hello World");
// testCode('car command', `(car (2 4 5 4 3))`, 2);
// testCode('cdr command', `(cdr (2 4 5 4 3))`, [4, 5, 4, 3]);
// testCode('cons command', `(cons 1 (2 3 'op'))`,[1, 2, 3, 'op']);
// testCode('list? command', `(list? (2 3 'op'))`, true );
// testCode('list? command', `(list?  'op')`, false );
// testCode('== operator', `(== 4 4)`, true);
// testCode('let command',`(let foo 4)(+ foo 4)`, 8);