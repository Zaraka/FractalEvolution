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
        zoom: e.data.zoom,
        loading: e.data.loading
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