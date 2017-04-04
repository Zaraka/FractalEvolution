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