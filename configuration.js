import {evaluate} from "./jayEl.js";
import {Context} from "./context.js";

export let keywords = ['def', 'let', 'say', 'car', 'cdr','cons', 'list?', 'null?', 'if'];


export var topContext = new Context(null);


export var operation = {
    '+': 
    function(context,list) { 
        return list.reduce((a, b) => { 
            return a + evaluate(context,b)
        },0);
    },
    '-': 
    function(context,list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a - evaluate(context,b)
        },evaluate(context,first_el));
        return result;
    },
    '*': 
    function(context,list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a * evaluate(context,b)
        },evaluate(context,first_el));
        return result;
    },
    '/': 
    function(context,list) {
        let first_el = list.shift();
        let result = list.reduce((a, b) => {
            return a / evaluate(context,b)
        },evaluate(context,first_el));
        return result;
    },
    '%':
    function(context,list){
        return evaluate(context,list[0]) % evaluate(context,list[1]);
    },
};

export var special = {
    'if':
    function(context, list){
        if(evaluate(context, list[0])){
            return evaluate(context,list[1]);
        }else if(list[2] !== 'undefined'){
            return evaluate(context,list[2]);
        }
    },
    'say':
    function(context,some_string){
        return evaluate(context,some_string);
    },
    'car':
    function(context,list){
        //onsole.log(JSON.stringify(list,null,2));
        return evaluate(context,list[0][0]);
    },
    'cdr':
    function(context,list){
        //console.log(JSON.stringify(list,null,2));
        let the_list = list[0];
        the_list.shift();
        return the_list.map(x => evaluate(context, x));
    },
    'cons':
    function(context,list){
        let atom = list[0];
        let the_list = list[1];
        the_list.unshift(atom);
        return the_list.map(x => evaluate(context, x));
    },
    'list?':
    function(context,list){
        return Array.isArray(list[0]);
    },
    'null?':
    function(context,list){
        return (list.length === 0 ? true : false); 
    },
    'let':
    function(context,list){
        context[list[0].atom] = evaluate(context,list[1]);
    },
    'def':
    function(context,list){
        //console.log('inside def', JSON.stringify(list,null,2));
        let method_name = list[0].atom;
        context[method_name] = {};
        context[method_name]['args'] = [];
        //context[method_name]['args'] = list[1].map(function(el){return el.atom});
        list[1].forEach(function(el,i){
            context[method_name]['args'][i] = {name: String(el.atom)};
        });
        context[method_name]['method'] = list[2];
        //console.log('context', JSON.stringify(topContext,null,2));
        //console.log(arguments);
        
    }
};

export var boolean = {
    '==':
    function(context, list){
        //console.log(JSON.stringify(list,null,2));
        return (evaluate(context, list[0]) === evaluate(context,list[1])? true : false);
    },
    '>':
    function(context,list){
        return (evaluate(context, list[0]) > evaluate(context,list[1]));
    },
    '<':
    function(context,list){
        return (evaluate(context,list[0]) < evaluate(context,list[1]));
    },
    '!=':
    function(context, list){
        return (evaluate(context,list[0]) !== evaluate(context,list[1]));
    }
};
