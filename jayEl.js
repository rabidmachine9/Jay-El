import {context, keywords, operation, special, boolean} from './configuration.js';


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
            }else if(atom.match(/(==|<|>)/)){
                tokens.push({type: 'BOOL', atom});
            }else if(atom.match(/[+-\\*%]/)){
                tokens.push({type: 'OPER', atom}); 
            }
            else{
                tokens.push({type: 'IND', atom});
            }
            if(char === ')') tokens.push(char);
            atom = '';
        }else if(char.match(/("|')/)){
            let firstQuoteIndex = i;
            atom += char;
            do{
                i++;
                atom += st[i];
            }while(st[i] !== char && firstQuoteIndex !== i);

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


function evaluate(atom){
    //console.log("Evaluating",JSON.stringify(atom,null,2));
    if(!Array.isArray(atom)){
        if(atom.type === 'NUM'){
            return Number(atom.atom);
        }else if(atom.type === 'STR'){
            return String(atom.atom).slice(1, -1);
        }else if(atom.type === 'IND'){
            //console.log('Identifier',atom);
            return context[String(atom.atom)]
        }
    }

    if(Array.isArray(atom)){
        let first_atom = atom.shift();
        if(Array.isArray(first_atom)){
            return evaluate(first_atom);
        }else if(first_atom.type === 'OPER'){
            return operation[first_atom.atom](atom);
        }else if(first_atom.type === 'KEY'){
            return special[first_atom.atom](atom);
        }else if(first_atom.type === 'BOOL'){
            return boolean[first_atom.atom](atom);
        }else{
            //console.log('returning a list');
            return atom;
        }
    }    
}


function execute(code){
    let tokens = tokenizer(code);
    let arr_tokens = tokens_to_arrays(tokens);
    arr_tokens.forEach(function(atom){
        evaluate(atom);
    });
}
