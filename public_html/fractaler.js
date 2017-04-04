function random(min, max) {
    return Math.random() * (max - min) + min;
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
function Vec3(/*x,y,z | vec3 | from,to*/) {
    var x = 0, y = 0, z = 0;
    if (arguments.length == 3) {
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
    } else if (arguments.length == 1) {
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

    return (this.x == that.x && this.y == that.y && this.z == that.z);
};
onmessage = function (e) {
    var imageData = new Uint8ClampedArray(e.data.width * e.data.height * 4);
    var entropy = drawMandelbroot(imageData,
        e.data.fractal,
        e.data.color,
        e.data.width,
        e.data.height,
        e.data.iterationMax,
        e.data.zoom,
        e.data.moveX,
        e.data.moveY,
        new Vec3(e.data.start),
        new Vec3(e.data.speed),
        new Vec3(e.data.a),
        new Vec3(e.data.b),
        new Vec3(e.data.c),
        new Vec3(e.data.d)
    );
    postMessage({
        fractalId: e.data.fractalId,
        imageData: imageData,
        entropy: entropy,
        width: e.data.width,
        height: e.data.height
    });
};

function createPixel(vec) {
    return [vec.x, vec.y, vec.z, vec.x + vec.y + vec.z];
}

function pallete(i, a, b, c, d) {
    if (typeof i !== "number" && typeof a !== "object" && typeof b !== "object" && typeof c !== "object" && typeof d !== "object") {
        throw new TypeError("pallete wrong arguments", "vector.js");
    }
    //return a + b*cos(2PI*(c*t+d));
    return new Vec3(c).mul(i).add(d).mul(Math.PI * 2).cos().mul(b).add(a).toRGB(); // My life is whole
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
            if (coloring == "simple") {
                if (start.x + speed.x < 255 && start.x + speed.x > 0) start.x += speed.x;
                if (start.y + speed.y < 255 && start.y + speed.y > 0) start.y += speed.y;
                if (start.z + speed.z < 255 && start.z + speed.z > 0) start.z += speed.z;
            } else if (coloring == "modulo") {
                start.add(speed).mod(255);
            }
            colors[i] = createPixel(start);
        }
    }

    return colors;
}

function drawMandelbroot(imageData, fractalMethod, coloring, width, height, max, zoom, moveX, moveY, start, speed, a, b, c, d) {
    var imagePos = 0;
    var colors = createPallete(coloring, max, start, speed, a, b, c, d);
    var entropy = 0;
    var lastColor = 0;

    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            var c_re = 1.5 * (col - width / 2.0) / (0.5 * zoom * width) + moveX;
            var c_im = (row - height / 2.0) / (0.5 * zoom * height) + moveY;
            var x = 0, y = 0;
            var iteration = 0;
            var x_new;
            if (fractalMethod == "quadratic") {
                while (x * x + y * y <= 4 && iteration < max) {
                    x_new = x * x - y * y + c_re;
                    y = 2 * x * y + c_im;
                    x = x_new;
                    iteration++;
                }
            } else if (fractalMethod == "cubic") {
                while (x * x + y * y <= 2 && iteration < max) {
                    x_new = x * x * x - 3 * x * (y * y) + c_re;
                    y = 3 * x * x * y - y * y * y + c_im;
                    x = x_new;
                    iteration++;
                }
            }

            var curColor;
            if (iteration < max) { //pain the crazy stuff
                curColor = colors[iteration];
                //ctx.putImageData(colors[iteration], col, row);
            }
            else { //pain inside
                curColor = colors[max - 1];
                //ctx.putImageData(pixelBlack, col, row);
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

    return entropy / (width * height);
}