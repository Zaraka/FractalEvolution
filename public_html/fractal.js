function putPixel(context, x, y, r, g, b, a) {
    var pixel = context.createImageData(1,1);
    var data = pixel.data;
    data[0] = r;
    data[1] = g;
    data[2] = b;
    data[3] = a;
    context.putImageData(pixel, x, y);
}

var ctx = document.getElementById('c').getContext('2d');
putPixel(ctx, 10, 10, 255, 0, 0, 127);

width = 500;
height = 500;
max = 50;

for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
        var c_re = (col - width/2.0)*4.0/width;
        var c_im = (row - height/2.0)*4.0/width;
        var x = 0, y = 0;
        var iteration = 0;
        while (x*x+y*y <= 4 && iteration < max) {
            var x_new = x*x - y*y + c_re;
            y = 2*x*y + c_im;
            x = x_new;
            iteration++;
        }
        if (iteration < max) putPixel(ctx, col, row, 255, 255, 255, 127);
        else putPixel(ctx, col, row, 0, 0, 0, 127);
    }
}