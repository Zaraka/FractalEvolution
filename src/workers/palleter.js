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
    var pos = 0;
    for(var y = 0; y < height; y++) {
        imageData.concat(row);
    }
}