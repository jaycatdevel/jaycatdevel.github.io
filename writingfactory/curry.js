// Curry
// http://javascriptweblog.wordpress.com/2010/04/05/curry-cooking-up-tastier-functions/

function toArray(a) {
    return Array.prototype.slice.call(a);
}

if (!Function.prototype.curry) {
    Function.prototype.curry = function () {
        if (arguments.length < 1) {
            return this;
        }

        var method = this;
        var args = toArray(arguments);
        return function () { return method.apply(this, args.concat(toArray(arguments))); };
    };
}
