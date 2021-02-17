import {topContext, keywords, operation, special, boolean} from './configuration.js';
import {Context} from "./context.js";


export function tokenizer(st){
    let tokens = new Array;
    let atom = '';
    for(var i=0;i<st.length;i++){
        let char = st[i];
        if(atom !== '' && (char === '(' || char === ' ' || char === ')')){
            if(atom.match(/^[0-9]+/)){
                tokens.push({type: 'NUM', atom}); 
            }else if(keywords.includes(atom)){
                tokens.push({type: 'KEY', atom});
            }else if(atom.match(/(==|<|>|!=)/)){
                tokens.push({type: 'BOOL', atom});
            }else if(atom.match(/[+-\\*%]/)){
                tokens.push({type: 'OPER', atom}); 
            }
            else{
                tokens.push({type: 'IND', atom});
            }
            if(char === ')' || char === '(') tokens.push(char);
            atom = '';
        }else if(char.match(/("|')/)){
            let firstChar = char;
            i++; //skipping character
            while(st[i] !== firstChar){
                atom += st[i];
                i++;
            }
            i++;//skipping character
            tokens.push({type: 'STR', atom});
            atom = '';
        }
        else if(char === '(' || char === ')'){
            if(Boolean(atom)){
                tokens.push({type: 'IND', atom});
                atom = '';
            }
            tokens.push(char);
        }else if(char !== ' ' && char !=='(' && char !== ')'){
            atom += char;
        }
    }
    
    return tokens;
}

function tokens_to_arrays(tokens){
    let an_array = [];
    
    while(tokens.length !== 0){
        let token = tokens.shift();
        if(token ==='('){
            an_array.push(tokens_to_arrays(tokens));
        }else if(token === ')'){
            return an_array;
        }else{
            an_array.push(token);
        }
    }
    return  an_array;
}


export function evaluate(context,atom){
    //console.log("Evaluating",JSON.stringify(atom,null,2));
    if(!Array.isArray(atom)){
        if(atom.type === 'NUM'){
            return Number(atom.atom);
        }else if(atom.type === 'STR'){
            return String(atom.atom);
        }else if(atom.type === 'IND'){
            //console.log('single IND')
            //console.log('Identifier',atom);
            if(context[String(atom.atom)] != undefined){
                //it is a variable
                console.log("context",JSON.stringify(context,null,2)); 
                if(context[String(atom.atom)]['method'] == undefined){
                    return context.lookup(String(atom.atom));
                }
            };
        }
    }

    if(Array.isArray(atom)){
        let first_atom = atom.shift();
        //console.log("first atom",first_atom);
        if(Array.isArray(context,first_atom)){
            return evaluate(context,first_atom);
        }else if(first_atom.type === 'BOOL'){
            return boolean[first_atom.atom](context,atom);
        }else if(first_atom.type === 'OPER'){
            return operation[first_atom.atom](context,atom);
        }else if(first_atom.type === 'KEY'){
            return special[first_atom.atom](context,atom);
        }else if(first_atom.type === 'IND'){
            //console.log('found IND');
            if(context[String(first_atom.atom)]['method'] == undefined){
                // console.log('found IND', first_atom.atom);
                // console.log("context",JSON.stringify(context,null,2)); 
                return context.lookup(String(atom.atom));
            }else{
                let methodContext = new Context(context);
                methodContext['args'] = [];
                atom.forEach(function(val,i){
                    let arg_name = context[first_atom.atom]['args'][i].name;
                    // console.log('Arg Name', arg_name);
                    methodContext[arg_name] = evaluate(context,val);
                });
                // console.log("first atom",first_atom); 
                // console.log("context",JSON.stringify(context,null,2));  
                // console.log("method context",JSON.stringify(methodContext,null,2));
                return evaluate(methodContext, context[first_atom.atom]['method']);                 
            }
        }else{
            //console.log('returning a list');
            return atom;
        }
    }    
}


export function execute(code){
    let tokens = tokenizer(code);
    let arr_tokens = tokens_to_arrays(tokens);
    //console.log("Tokens", JSON.stringify(arr_tokens,null,2));
    var result;
    arr_tokens.forEach(function(atom){
        //console.log("Array Token",JSON.stringify(atom,null,2));
        result = evaluate(topContext,atom);
    });
    return result;
}
