export let keywords = ['def', 'let', 'say', 'car', 'cdr','cons', 'list?', 'null?'];

export var context = {

};


export var operation = {
    '+': 
    function(list) { 
        return list.reduce((a, b) => { 
            return a + evaluate(b)
        },0);
    },
    '-': 
    function(list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a - evaluate(b)
        },evaluate(first_el));
        return result;
    },
    '*': 
    function(list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a * evaluate(b)
        },evaluate(first_el));
        return result;
    },
    '/': 
    function(list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a / evaluate(b)
        },evaluate(first_el));
        return result;
    },
    '%':
    function(list){
        return evaluate(list[0]) % evaluate(list[1]);
    },
};

export var special = {
    'say':
    function(some_string){
        return evaluate(some_string);
    },
    'car':
    function(list){
        //onsole.log(JSON.stringify(list,null,2));
        return evaluate(list[0][0]);
    },
    'cdr':
    function(list){
        //console.log(JSON.stringify(list,null,2));
        let the_list = list[0];
        the_list.shift();
        return the_list.map(evaluate);
    },
    'cons':
    function(list){
        let atom = list[0];
        let the_list = list[1];
        the_list.unshift(atom);
        return the_list.map(evaluate);
    },
    'list?':
    function(list){
        return Array.isArray(list[0]);
    },
    'null?':
    function(list){
        return (list.length === 0 ? true : false); 
    },
    'let':
    function(list){
        context[list[0].atom] = evaluate(list[1]);
    },
    'def':
    function(list){
        console.log(JSON.stringify(list,null,2));
        context[list[0].atom] = {};
    }
};

export var boolean = {
    '==':
    function(list){
        //console.log(JSON.stringify(list,null,2));
        return (evaluate(list[0]) === evaluate(list[1])? true : false);
    },
    '>':
    function(list){
        return (list[0] > list[1]);
    },
    '<':
    function(list){
        return (list[0] < list[1]);
    },
};