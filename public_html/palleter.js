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

function pallete(i, a, b, c, d) {
    if (typeof i !== "number" && typeof a !== "object" && typeof b !== "object" && typeof c !== "object" && typeof d !== "object") {
        throw new TypeError("pallete wrong arguments", "vector.js");
    }
    //return a + b*cos(2PI*(c*t+d));
    return new Vec3(c).mul(i).add(d).mul(Math.PI * 2).cos().mul(b).add(a).toRGB(); // My life is whole
}

onmessage = function (e) {
    var imageData = new Uint8ClampedArray(e.data.width * e.data.height * 4);
    drawPallete(imageData,
        e.data.width,
        e.data.height,
        new Vec3(e.data.a),
        new Vec3(e.data.b),
        new Vec3(e.data.c),
        new Vec3(e.data.d)
    );
    postMessage({
        imageData: imageData
    });
};

function drawPallete(imageData, width, height, a,b,c,d) {
    var slice = 1 / width;
    var sliceSum = 0;
    var vec;
    var row = [];
    for(var x = 0; x < width; x++) {
        vec = pallete(sliceSum, a,b,c,d);
        sliceSum += slice;
        row.concat([vec.x,vec.y,vec.z,255]);
    }
    for(var y = 0; y < height; y++) {
        imageData.concat(row);
    }
}