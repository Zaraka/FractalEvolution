/**
 * Chromosone structure as follows
 * iterationMax integer
 * zoom         float
 * moveX        float
 * moveY        float
 * redStart     integer
 * greenStart   integer
 * blueStart    integer
 * redSpeed     integer
 * greenSpeed   integer
 * blueSpeed    integer
 * a            Vec3
 * b            Vec3
 * c            Vec3
 * d            Vec3
 */

function Chromosone(/* settings or chromosone*/) {
    if (arguments.length === 1) {
        if (typeof arguments[0] === "undefined") {
            throw new TypeError("Chromosone undefined input", "chromosone.js");
        } else {
            var name = arguments[0].constructor.name;
            if (name === "Chromosone") { // copy
                var that = arguments[0];
                this.iterationMax = that.iterationMax;
                this.zoom = that.zoom;
                this.moveX = that.moveX;
                this.moveY = that.moveY;
                if(typeof that.a === "undefined") {
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
            } else { // create
                var settings = arguments[0];
                this.iterationMax = generateValue(null, settings.structure.iterationMax, settings.fractal);
                this.zoom = generateValue(null, settings.structure.zoom, settings.fractal);
                this.moveX = generateValue(null, settings.structure.moveX, settings.fractal);
                this.moveY = generateValue(null, settings.structure.moveY, settings.fractal);

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
            }
        }
    } else {
        throw new SyntaxError("Chromosone invalid arguments", "chromosone.js");
    }
}

Chromosone.prototype.mutate = function (settings) {
    var structure = settings.structure;
    if (Math.random() <= structure.iterationMax.chance)
        this.iterationMax = this.generateValue(this.iterationMax, structure.iterationMax);
    if (Math.random() <= structure.zoom.chance)
        this.zoom = this.generateValue(this.zoom, structure.zoom, settings.fractal);
    if (Math.random() <= structure.moveX.chance)
        this.moveX = this.generateValue(this.moveX, structure.moveX, settings.fractal);
    if (Math.random() <= structure.moveY.chance)
        this.moveY = this.generateValue(this.moveY, structure.moveY, settings.fractal);
    if (this.settings.color === "pallete") {
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
            this.redStart = this.generateValue(this.redStart, structure.redStart, settings.fractal);
        if (Math.random() <= structure.greenStart.chance)
            this.greenStart = this.generateValue(this.greenStart, structure.greenStart, settings.fractal);
        if (Math.random() <= structure.blueStart.chance)
            this.blueStart = this.generateValue(this.blueStart, structure.blueStart, settings.fractal);
        if (Math.random() <= structure.redSpeed.chance)
            this.redSpeed = this.generateValue(this.redSpeed, structure.redSpeed, settings.fractal);
        if (Math.random() <= structure.greenSpeed.chance)
            this.greenSpeed = this.generateValue(this.greenSpeed, structure.greenSpeed, settings.fractal);
        if (Math.random() <= structure.blueSpeed.chance)
            this.blueSpeed = this.generateValue(this.blueSpeed, structure.blueSpeed, settings.fractal);
    }
};

function generateValue(oldValue, structure, fractal) {
    if (structure.type === "vec3") {
        return new Vec3();
    }
    var result = 0;
    var from = structure.min;
    var range = (Math.abs(structure.min) + Math.abs(structure.max)) * structure.limit[fractal];
    var to = from + range;
    if (structure.method === "random" || oldValue === null) {
        result = random(from, to);
    } else {
        do {
            result = oldValue + (Math.random() * range * random(-structure.intensity, structure.intensity));
        } while (result < structure.min || result > structure.max);
    }

    if (structure.type === "integer")
        result = Math.round(result);

    return result;
}

function equalChromosones(a, b, color) {
    if(color === "pallete") {
        return a.iterationMax == b.iterationMax &&
            a.zoom == b.zoom &&
            a.moveX == b.moveX &&
            a.moveY == b.moveY &&
            a.a.equals(b.a) &&
            a.b.equals(b.b) &&
            a.c.equals(b.c) &&
            a.d.equals(b.d);
    } else {
        return a.iterationMax == b.iterationMax &&
            a.zoom == b.zoom &&
            a.moveX == b.moveX &&
            a.moveY == b.moveY &&
            a.redStart == b.redStart &&
            a.greenStart == b.greenStart &&
            a.blueStart == b.blueStart &&
            a.redSpeed == b.redSpeed &&
            a.greenSpeed == b.greenSpeed &&
            a.blueSpeed == b.blueSpeed;
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}