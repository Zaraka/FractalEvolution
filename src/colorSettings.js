function colorSettings(/*start, speed, a, b, c, d*/) {
    var start = 0, speed = 0, a = 0, b = 0, c = 0, d = 0;
    if(arguments.length === 6) {
        start = arguments[0];
        speed = arguments[1];
        a = arguments[2];
        b = arguments[3];
        c = arguments[4];
        d = arguments[5];
    }
    this.start = start;
    this.speed = speed;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
}