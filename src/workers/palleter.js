//TODO: Refactor this to single method or something

onmessage = function (e) {
    //console.log(e.data);
    var imageData = new Uint8ClampedArray(e.data.width * e.data.height * 4);
    if(e.data.color === "pallete") {
        drawPallete(imageData,
            e.data.width,
            e.data.height,
            new Vec3(e.data.a),
            new Vec3(e.data.b),
            new Vec3(e.data.c),
            new Vec3(e.data.d)
        );
    } else if(e.data.color === "simple") {
        drawGradient(imageData,
            e.data.iterations,
            e.data.width,
            e.data.height,
            new Vec3(e.data.start),
            new Vec3(e.data.speed));
    } else if(e.data.color === "modulo") {
        drawModulo(imageData,
            e.data.iterations,
            e.data.width,
            e.data.height,
            new Vec3(e.data.start),
            new Vec3(e.data.speed));
    }
    postMessage({
        imageData: imageData
    });
};

function drawGradient(imageData, iterations, width, height, start, speed) {
    var increase = Math.ceil(iterations / width);
    var pos = 0;
    var row = width * 4;
    
    for(var x = 0; x < width; x++) {
        for(var step = 0; step < increase; step++) {
            if (start.x + speed.x < 255 && start.x + speed.x > 0) start.x += speed.x;
            if (start.y + speed.y < 255 && start.y + speed.y > 0) start.y += speed.y;
            if (start.z + speed.z < 255 && start.z + speed.z > 0) start.z += speed.z;
        }
        imageData[pos] = start.x;
        pos++;
        imageData[pos] = start.y;
        pos++;
        imageData[pos] = start.z;
        pos++;
        imageData[pos] = 255;
        pos++;
    }

    for(var y = 0; y < height; y++) {
        imageData.copyWithin(pos, 0, row);
        pos += row;
    }
}

function drawModulo(imageData, iterations, width, height, start, speed) {
    var increase = Math.ceil(iterations / width);
    var pos = 0;
    var row = width * 4;

    for(var x = 0; x < width; x++) {
        for(var step = 0; step < increase; step++) {
            start.add(speed).mod(255);
        }
        imageData[pos] = start.x;
        pos++;
        imageData[pos] = start.y;
        pos++;
        imageData[pos] = start.z;
        pos++;
        imageData[pos] = 255;
        pos++;
    }

    for(var y = 0; y < height; y++) {
        imageData.copyWithin(pos, 0, row);
        pos += row;
    }
}

function drawPallete(imageData, width, height, a,b,c,d) {
    var slice = 1 / width;
    var sliceSum = 0;
    var vec;
    var pos = 0;
    var row = width * 4;
    for(var x = 0; x < width; x++) {
        vec = pallete(sliceSum, a,b,c,d);
        sliceSum += slice;
        imageData[pos] = vec.x;
        pos++;
        imageData[pos] = vec.y;
        pos++;
        imageData[pos] = vec.z;
        pos++;
        imageData[pos] = 255;
        pos++;
    }

    for(var y = 0; y < height; y++) {
        imageData.copyWithin(pos, 0, row);
        pos += row;
    }
}