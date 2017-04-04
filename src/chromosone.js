/**
 * Chromosone structure as follows
 * iterationMax
 * zoom
 * moveX
 * moveY
 * redStart
 * greenStart
 * blueStart
 * redSpeed
 * greenSpeed
 * blueSpeed
 * a
 * b
 * c
 * d
 */

function Chromosone(/* settings or chromosone*/) {
    if(arguments.length === 1) {
        if(typeof arguments[0] === "undefined") {
            throw new TypeError("Chromosone undefined input", "chromosone.js");
        } else {
            var name = arguments[0].constructor.name;
            if(name === "Chromosone") { // copy

            } else {

            }
        }
    } else {
        throw new SyntaxError("Chromosone invalid arguments", "chromosone.js");
    }
}

Chromosone.prototype.mutate = function (settings) {

};

Chromosone.prototype.toMessage = function (settings) {

};