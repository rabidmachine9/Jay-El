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
      assert.equal(execute(`(car (2 4 5 4 3))`), 2);
  });
});

describe('cdr command', function(){
  it('should remove first element of list', function(){
      assert.deepEqual(execute(`(cdr (2 4 5 4 3))`), [4, 5, 4, 3]);
  });
});


describe('cons command', function(){
  it('should insert an element in a list', function(){
      assert.deepEqual(execute(`(cons 1 (2 3 'op'))`), [1, 2, 3, 'op']);
  });
});

describe('cons command', function(){
  it('should insert an element in a list', function(){
      assert.deepEqual(execute(`(cons 1 (2 3 'op'))`), [1, 2, 3, 'op']);
  });
});

describe('list? command', function(){
  it('should detect a list', function(){
      assert.equal(execute(`(list? (2 3 'op'))`), true);
  });
});


describe('== operator', function(){
  it('should detect equality', function(){
      assert.equal(execute(`(== 4 4)`), true);
  });
});

describe('!= operator', function(){
  it('should detect inequality', function(){
      assert.equal(execute(`(!= 4 3)`), true);
  });
});


describe('> operator', function(){
  it('should detect bigger', function(){
      assert.equal(execute(`(> 4 3)`), true);
  });
});


describe('< operator', function(){
  it('should detect smaller', function(){
      assert.equal(execute(`(< 4 3)`), false);
  });
});

describe('let keyword', function(){
  it('should declare a variable', function(){
      assert.equal(execute(`(let man 3)(+ man 3)`), 6);
  });
});

describe('def keyword', function(){
  it('should define a function', function(){
      assert.equal(execute(`(def add(a b)(+ a b))(add 2 4)`), 6);
  });
});

describe('if cond', function(){
  it('should define a bool operator', function(){
    assert.equal(execute(`(if (== 3 1) (+ 2 3) (- 3 2))`), 1);
  });
});