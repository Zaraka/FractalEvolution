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