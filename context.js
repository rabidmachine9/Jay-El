class Context {
    constructor(parent){
        this.parent = parent;
    }

    lookup(key){
        if(exists(this[key])){
            return this[key];
        }else this.parent.lookup(key);
    }
}