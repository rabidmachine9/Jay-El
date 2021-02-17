export class Context {
    constructor(parent){
        this.parent = parent;
    }

    lookup(key){
        if(typeof this[key] !== 'undefined'){
            console.log(key, 'value is', this[key]);
            return this[key];
        }else this.parent.lookup(key);
    }
}