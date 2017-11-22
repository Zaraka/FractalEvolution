function Chromosone(/* settings or chromosone*/) {
    if (arguments.length < 1 && arguments.length > 1 ) {
        throw new SyntaxError("Chromosone invalid arguments", "chromosone.js");
    }

    if (typeof arguments[0] === "undefined") {
        throw new TypeError("Chromosone undefined input", "chromosone.js");
    }


    var name = arguments[0].constructor.name;
    if(name === "Settings") {
        // create
        var settings = arguments[0];
        this.iterationMax = generateValue(null, settings.structure.iterationMax, settings.fractal);
        if(settings.noZoom) {
            this.zoom = 1.0;
            this.moveX = settings.structure.moveX.limit[settings.fractal].center;
            this.moveY = settings.structure.moveY.limit[settings.fractal].center;
        } else {
            this.zoom = generateValue(null, settings.structure.zoom, settings.fractal);
            this.moveX = generateValue(null, settings.structure.moveX, settings.fractal);
            this.moveY = generateValue(null, settings.structure.moveY, settings.fractal);
        }

        if (settings.fractal === "glynn_all" || settings.fractal === "julia_quadratic") {
            this.cRe = generateValue(null, settings.structure.cRe, settings.fractal);
            if (settings.fractal === "julia_quadratic") {
                this.cIm = generateValue(null, settings.structure.cIm, settings.fractal);
            } else {
                this.exp = generateValue(null, settings.structure.exp, settings.fractal);
            }
        }

        if (settings.color === "pallete") {
            this.a = generateValue(null, settings.structure.a, settings.fractal);
            this.b = generateValue(null, settings.structure.b, settings.fractal);
            this.c = generateValue(null, settings.structure.c, settings.fractal);
            this.d = generateValue(null, settings.structure.d, settings.fractal);
        } else {
            this.redStart = generateValue(null, settings.structure.redStart, settings.fractal);
            this.greenStart = generateValue(null, settings.structure.greenStart, settings.fractal);
            this.blueStart = generateValue(null, settings.structure.blueStart, settings.fractal);
            this.redSpeed = generateValue(null, settings.structure.redSpeed, settings.fractal);
            this.greenSpeed = generateValue(null, settings.structure.greenSpeed, settings.fractal);
            this.blueSpeed = generateValue(null, settings.structure.blueSpeed, settings.fractal);
        }
    } else { // copy
        var that = arguments[0];
        this.iterationMax = that.iterationMax;
        this.zoom = that.zoom;
        this.moveX = that.moveX;
        this.moveY = that.moveY;

        if (typeof that.cRe !== "undefined") {
            this.cRe = that.cRe;
        }
        if (typeof that.cIm !== "undefined") {
            this.cIm = that.cIm;
        }
        if (typeof that.exp !== "undefined") {
            this.exp = that.exp;
        }

        if (typeof that.a === "undefined") {
            this.redStart = that.redStart;
            this.greenStart = that.greenStart;
            this.blueStart = that.blueStart;
            this.redSpeed = that.redSpeed;
            this.greenSpeed = that.greenSpeed;
            this.blueSpeed = that.blueSpeed;
        } else {
            this.a = new Vec3(that.a);
            this.b = new Vec3(that.b);
            this.c = new Vec3(that.c);
            this.d = new Vec3(that.d);
        }
    }
}

Chromosone.prototype.mutate = function (settings) {
    var structure = settings.structure;
    if (Math.random() <= structure.iterationMax.chance)
        this.iterationMax = generateValue(this.iterationMax, structure.iterationMax, settings.fractal);

    if(!noZoom) {
        if (Math.random() <= structure.zoom.chance)
            this.zoom = generateValue(this.zoom, structure.zoom, settings.fractal);
        if (Math.random() <= structure.moveX.chance)
            this.moveX = generateValue(this.moveX, structure.moveX, settings.fractal);
        if (Math.random() <= structure.moveY.chance)
            this.moveY = generateValue(this.moveY, structure.moveY, settings.fractal);
    }

    if (settings.fractal === "glynn_all" || settings.fractal === "julia_quadratic") {
        if (Math.random() <= structure.cRe.chance)
            this.cRe = generateValue(this.cRe, structure.cRe, settings.fractal);
        if (settings.fractal === "julia_quadratic") {
            if (Math.random() <= structure.cIm.chance)
                this.cIm = generateValue(this.cIm, structure.cIm, settings.fractal);
        } else {
            if (Math.random() <= structure.exp.chance)
                this.exp = generateValue(this.exp, structure.exp, settings.fractal);
        }
    }

    if (settings.color === "pallete") {
        if (Math.random() <= structure.a.chance)
            this.a = new Vec3();
        if (Math.random() <= structure.b.chance)
            this.b = new Vec3();
        if (Math.random() <= structure.c.chance)
            this.c = new Vec3();
        if (Math.random() <= structure.d.chance)
            this.d = new Vec3();

    } else {
        if (Math.random() <= structure.redStart.chance)
            this.redStart = generateValue(this.redStart, structure.redStart, settings.fractal);
        if (Math.random() <= structure.greenStart.chance)
            this.greenStart = generateValue(this.greenStart, structure.greenStart, settings.fractal);
        if (Math.random() <= structure.blueStart.chance)
            this.blueStart = generateValue(this.blueStart, structure.blueStart, settings.fractal);
        if (Math.random() <= structure.redSpeed.chance)
            this.redSpeed = generateValue(this.redSpeed, structure.redSpeed, settings.fractal);
        if (Math.random() <= structure.greenSpeed.chance)
            this.greenSpeed = generateValue(this.greenSpeed, structure.greenSpeed, settings.fractal);
        if (Math.random() <= structure.blueSpeed.chance)
            this.blueSpeed = generateValue(this.blueSpeed, structure.blueSpeed, settings.fractal);
    }
};


/**
 * Generate new value in chromosone
 * @param {number} oldValue
 * @param {Object} structure
 * @param {string} fractal
 * @returns {number | Object}
 */
function generateValue(oldValue, structure, fractal) {
    if (structure.type === "vec3") {
        return new Vec3();
    }
    var result = 0;
    var from = structure.limit[fractal].min;
    var range = Math.abs(structure.limit[fractal].min) + Math.abs(structure.limit[fractal].max);
    var to = from + range;
    if (structure.method === "random" || oldValue === null) {
        if (structure.method === "random" && structure.distribution === "exp") {
            result = randomExp(from, to);
        } else {
            result = random(from, to);
        }
    } else {
        do {
            result = oldValue + (Math.random() * range * random(-structure.intensity, structure.intensity));
        } while (result < structure.limit[fractal].min || result > structure.limit[fractal].max);
    }

    if (structure.type === "integer")
        result = Math.round(result);

    return result;
}

/**
 *
 * @param {Object} a chromosone
 * @param {Object} b chromosone
 * @param {Object} settings
 * @returns {boolean} true if a and b are same chromosones, false otherwise
 */
function equalChromosones(a, b, settings) {
    //test common
    if (a.iterationMax !== b.iterationMax || a.zoom !== b.zoom || a.moveX !== b.moveX || a.moveY !== b.moveY)
        return false;

    //test special
    if (settings.fractal === "julia_quadratic") {
        if (a.cRe !== b.cRe || a.cIm !== b.cIm)
            return false;
    } else if (settings.fractal === "glynn_all") {
        if (a.cRe !== b.cRe || a.exp !== b.exp)
            return false;
    }

    //test colors
    if (settings.color === "pallete" && (!a.a.equals(b.a) || !a.b.equals(b.b) || !a.c.equals(b.c) || !a.d.equals(b.d))) {
        return false;
    } else if (a.redStart !== b.redStart ||
        a.greenStart !== b.greenStart ||
        a.blueStart !== b.blueStart ||
        a.redSpeed !== b.redSpeed ||
        a.greenSpeed !== b.greenSpeed ||
        a.blueSpeed !== b.blueSpeed) {
        return false;
    }

    return true;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate random number with exponential distribution
 * @param {number} min
 * @param {number} max
 * @returns {number} random number between min and max with exponential distribution
 */
function randomExp(min, max) {
    return Math.pow(Math.random(), 2) * (max - min) + min;
}