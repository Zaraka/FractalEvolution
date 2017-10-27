function Chromosone(/* settings or chromosone*/) {
    if (arguments.length === 1) {
        if (typeof arguments[0] === "undefined") {
            throw new TypeError("Chromosone undefined input", "chromosone.js");

        } else {
            var name = arguments[0].constructor.name;
            if(name === "Settings") {
                // create
                var settings = arguments[0];
                this.iterationMax = generateValue(null, settings.structure.iterationMax, settings.fractal);
                this.zoom = generateValue(null, settings.structure.zoom, settings.fractal);
                this.moveX = generateValue(null, settings.structure.moveX, settings.fractal);
                this.moveY = generateValue(null, settings.structure.moveY, settings.fractal);

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
    } else {
        throw new SyntaxError("Chromosone invalid arguments", "chromosone.js");
    }
}

Chromosone.prototype.mutate = function (settings) {
    var structure = settings.structure;
    if (Math.random() <= structure.iterationMax.chance)
        this.iterationMax = generateValue(this.iterationMax, structure.iterationMax, settings.fractal);
    if (Math.random() <= structure.zoom.chance)
        this.zoom = generateValue(this.zoom, structure.zoom, settings.fractal);
    if (Math.random() <= structure.moveX.chance)
        this.moveX = generateValue(this.moveX, structure.moveX, settings.fractal);
    if (Math.random() <= structure.moveY.chance)
        this.moveY = generateValue(this.moveY, structure.moveY, settings.fractal);

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
function Rect(/*x,y,w,h | vec2,vex2*/) {
    var x = 0, y = 0, width = 0, height = 0;
    if(arguments.length === 4) {
        x = arguments[0];
        y = arguments[1];
        width = arguments[2];
        height = arguments[3];
    } else if (arguments.length === 2) {
        x = arguments[0].x;
        y = arguments[0].y;
        width = arguments[1].x;
        height = arguments[1].y;
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function Vec2(/*x, y | vec2*/) {
    var x = 0, y = 0;
    if(arguments.length === 2) {
        x = arguments[0];
        y = arguments[1];
    } else if (arguments.length === 1) {
        var vec2 = arguments[0];
        if(typeof  vec2 !== "undefined") {
            x = vec2.x;
            y = vec2.y;
        }
    }
    this.x = x;
    this.y = y;
}

function Vec3(/*x,y,z | vec3 | from,to*/) {
    var x = 0, y = 0, z = 0;
    if (arguments.length === 3) {
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
    } else if (arguments.length === 1) {
        var vec3 = arguments[0];
        if (typeof vec3 !== "undefined") {
            x = vec3.x;
            y = vec3.y;
            z = vec3.z;
        }
    } else {
        x = Math.random();
        y = Math.random();
        z = Math.random();
    }
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.sin = function () {
    this.x = Math.sin(this.x);
    this.y = Math.sin(this.y);
    this.z = Math.sin(this.z);
    return this;
};

Vec3.prototype.cos = function () {
    this.x = Math.cos(this.x);
    this.y = Math.cos(this.y);
    this.z = Math.cos(this.z);
    return this;
};

Vec3.prototype.add = function (that) {
    if (typeof that === "number") {
        this.x += that;
        this.y += that;
        this.z += that;
    } else {
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
    }
    return this;
};

Vec3.prototype.sub = function (that) {
    if (typeof that === "number") {
        this.x += -that;
        this.y += -that;
        this.z += -that;
    } else {
        this.x += -that.x;
        this.y += -that.y;
        this.z += -that.z;
    }
    return this;
};

Vec3.prototype.mul = function (that) {
    if (typeof that === "number") {
        this.x *= that;
        this.y *= that;
        this.z *= that;
    } else {
        this.x *= that.x;
        this.y *= that.y;
        this.z *= that.z;
    }
    return this;
};

Vec3.prototype.mod = function (that) {
    if (typeof that === "number") {
        this.x %= that;
        this.y %= that;
        this.z %= that;
    } else {
        this.x %= that.x;
        this.y %= that.y;
        this.z %= that.z;
    }
    return this;
};

Vec3.prototype.toRGB = function () {
    this.x = Math.round(this.x * 255);
    this.y = Math.round(this.y * 255);
    this.z = Math.round(this.z * 255);
    return this;
};

Vec3.prototype.equals = function (that) {
    if (typeof that !== "object") {
        return false;
    }

    if (this === that) {
        return true;
    }

    return (this.x === that.x && this.y === that.y && this.z === that.z);
};

function pallete(i, a, b, c, d) {
    if (typeof i !== "number" && typeof a !== "object" && typeof b !== "object" && typeof c !== "object" && typeof d !== "object") {
        throw new TypeError("pallete wrong arguments", "vector.js");
    }
    //return a + b*cos(2PI*(c*t+d));
    return new Vec3(c).mul(i).add(d).mul(Math.PI * 2).cos().mul(b).add(a).toRGB(); // My life is whole
}

onmessage = function (e) {
    //console.log(e.data);
    var imageData = new Uint8ClampedArray(e.data.resolution.x * e.data.resolution.y * 4);
    var entropy;
    var method = e.data.fractal.split("_");
    var zoom = (e.data.fractalId === "preview") ? 0.9 : e.data.zoom;
    var move = (typeof e.data.limit === "undefined") ? new Vec2(e.data.moveX, e.data.moveY) : e.data.limit ;
    if (method[0] === "mandelbroot") {
        entropy = drawMandelbroot(imageData,
            method[1],
            e.data.color,
            e.data.resolution,
            e.data.iterationMax,
            zoom,
            move,
            new Vec3(e.data.start),
            new Vec3(e.data.speed),
            new Vec3(e.data.a),
            new Vec3(e.data.b),
            new Vec3(e.data.c),
            new Vec3(e.data.d)
        );
    } else if (method[0] === "julia") {
        entropy = drawJulia(imageData,
            e.data.color,
            e.data.resolution,
            e.data.iterationMax,
            zoom,
            move,
            e.data.cRe,
            e.data.cIm,
            new Vec3(e.data.start),
            new Vec3(e.data.speed),
            new Vec3(e.data.a),
            new Vec3(e.data.b),
            new Vec3(e.data.c),
            new Vec3(e.data.d)
        );
    } else if (method[0] === "glynn") {
        entropy = drawGlynn(imageData,
            e.data.color,
            e.data.resolution,
            e.data.iterationMax,
            zoom,
            move,
            e.data.cRe,
            e.data.exp,
            new Vec3(e.data.start),
            new Vec3(e.data.speed),
            new Vec3(e.data.a),
            new Vec3(e.data.b),
            new Vec3(e.data.c),
            new Vec3(e.data.d)
        );
    }

    postMessage({
        fractalId: e.data.fractalId,
        imageData: imageData,
        entropy: entropy,
        resolution: e.data.resolution,
        move: new Vec2(e.data.moveX, e.data.moveY),
        zoom: e.data.zoom
    });
};

/**
 * Creates array with RGB pixel
 * @param vec with RGB color
 * @returns {[number,number,number,number]}
 */
function createPixel(vec) {
    return [vec.x, vec.y, vec.z, vec.x + vec.y + vec.z];
}

function createPallete(coloring, max, start, speed, a, b, c, d) {
    var colors = [];

    if (coloring === "pallete") {
        var slice = 1.0 / max;
        var sliceSum = 0.0;
        for (var j = 0; j < max; j++) {
            colors[j] = createPixel(pallete(sliceSum, a, b, c, d));
            sliceSum += slice;
        }
    } else {
        for (var i = 0; i < max; i++) {
            if (coloring === "simple") {
                if (start.x + speed.x < 255 && start.x + speed.x > 0) start.x += speed.x;
                if (start.y + speed.y < 255 && start.y + speed.y > 0) start.y += speed.y;
                if (start.z + speed.z < 255 && start.z + speed.z > 0) start.z += speed.z;
            } else if (coloring === "modulo") {
                start.add(speed).mod(255);
            }
            colors[i] = createPixel(start);
        }
    }

    return colors;
}

function drawMandelbroot(imageData, fractalMethod, coloring, resolution, max, zoom, move, start, speed, a, b, c, d) {
    var imagePos = 0;
    var colors = createPallete(coloring, max, start, speed, a, b, c, d);
    var entropy = 0;
    var lastColor = 0;
    var curColor;

    for (var row = 0; row < resolution.y; row++) {
        for (var col = 0; col < resolution.x; col++) {
            var c_re = 1.5 * (col - resolution.x / 2.0) / (0.5 * zoom * resolution.x) + move.x;
            var c_im = (row - resolution.y / 2.0) / (0.5 * zoom * resolution.y) + move.y;
            var x = 0, y = 0;
            var iteration = 0;
            var x_new;
            if (fractalMethod === "quadratic") {
                while (x * x + y * y <= 4 && iteration < max) {
                    x_new = x * x - y * y + c_re;
                    y = 2 * x * y + c_im;
                    x = x_new;
                    iteration++;
                }
            } else if (fractalMethod === "cubic") {
                while (x * x + y * y <= 4 && iteration < max) {
                    x_new = x * x * x - 3 * x * (y * y) + c_re;
                    y = 3 * x * x * y - y * y * y + c_im;
                    x = x_new;
                    iteration++;
                }
            }

            if (iteration < max) { //paint the crazy stuff
                curColor = colors[iteration];
            }
            else {                  //pain inside bounds
                curColor = colors[max - 1];
            }
            imageData[imagePos] = curColor[0];
            imagePos++;
            imageData[imagePos] = curColor[1];
            imagePos++;
            imageData[imagePos] = curColor[2];
            imagePos++;
            imageData[imagePos] = 255;
            imagePos++;
            if (curColor[3] !== lastColor) {
                entropy += lastColor;
            }
            lastColor = curColor[3];
        }
    }

    return entropy / (resolution.x * resolution.y);
}

function drawJulia(imageData, coloring, resolution, max, zoom, move, cRe, cIm, start, speed, a, b, c, d) {
    var imagePos = 0;
    var colors = createPallete(coloring, max, start, speed, a, b, c, d);
    var entropy = 0;
    var lastColor = 0;
    var newRe, newIm, oldRe, oldIm;
    var iteration;
    var curColor;

    for (var y = 0; y < resolution.y; y++) {
        for (var x = 0; x < resolution.x; x++) {
            newRe = 1.5 * (x - resolution.x / 2) / (0.5 * zoom * resolution.x) + move.x;
            newIm = (y - resolution.y / 2) / (0.5 * zoom * resolution.y) + move.y;

            for (iteration = 0; iteration < max && (newRe * newRe + newIm * newIm) < 4; iteration++) {
                oldRe = newRe;
                oldIm = newIm;
                newRe = oldRe * oldRe - oldIm * oldIm + cRe;
                newIm = 2 * oldRe * oldIm + cIm;
            }
            if (iteration < max) { //paint the crazy stuff
                curColor = colors[iteration];
            }
            else {                  //pain inside bounds
                curColor = colors[max - 1];
            }
            imageData[imagePos] = curColor[0];
            imagePos++;
            imageData[imagePos] = curColor[1];
            imagePos++;
            imageData[imagePos] = curColor[2];
            imagePos++;
            imageData[imagePos] = 255;
            imagePos++;
            if (curColor[3] !== lastColor) {
                entropy += lastColor;
            }
            lastColor = curColor[3];
        }
    }

    return entropy / (resolution.x * resolution.y);
}

function drawGlynn(imageData, coloring, resolution, max, zoom, move, cRe, exp, start, speed, a, b, c, d) {
    var imagePos = 0;
    var colors = createPallete(coloring, max, start, speed, a, b, c, d);
    var entropy = 0;
    var lastColor = 0;

    var zRe, zIm;
    var r, o;
    var iteration;
    var curColor;

    for (var y = 0; y < resolution.y; y++) {
        for (var x = 0; x < resolution.x; x++) {
            zRe = 1.5 * (x - resolution.x / 2) / (0.5 * zoom * resolution.x) + move.x;
            zIm = (y - resolution.y / 2) / (0.5 * zoom * resolution.y) + move.y;
            for (iteration = 0; iteration < max && (zRe * zRe + zIm * zIm) < 4; iteration++) {
                o = Math.atan2(zIm, zRe);
                r = Math.sqrt(zRe * zRe + zIm * zIm);
                zRe = Math.pow(r, exp) * Math.cos(exp * o) + cRe;
                zIm = Math.pow(r, exp) * Math.sin(exp * o);
            }

            if (iteration < max) { //paint the crazy stuff
                curColor = colors[iteration];
            }
            else {  //pain inside bounds
                curColor = colors[max - 1];
            }
            imageData[imagePos] = curColor[0];
            imagePos++;
            imageData[imagePos] = curColor[1];
            imagePos++;
            imageData[imagePos] = curColor[2];
            imagePos++;
            imageData[imagePos] = 255;
            imagePos++;
            if (curColor[3] !== lastColor) {
                entropy += lastColor;
            }
            lastColor = curColor[3];
        }
    }

    return entropy / (resolution.x * resolution.y);
}