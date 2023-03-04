window.$ = {
    data: function(obj, key, val) {
        if(!obj) {
            return this._data;
        } else if(!key) {
            if(!(obj in this._data)) {
                return {};
            }
            return this._data[obj];
        } else if(arguments.length < 3) {
            if(!(obj in this._data)) {
                return undefined;
            }
            return this._data[obj][key];
        } else {
            if(!(obj in this._data)) {
                this._data[obj] = {};
            }
            this._data[obj][key] = val;
        }
    },
    _data: {}
};