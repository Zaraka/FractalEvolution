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

                if (typeof that.cRe !== "undefined") {
                    this.cRe = that.cRe;
                }
                if (typeof that.cIm !== "undefined") {
                    this.cIm = that.cIm;
                }
                if (typeof that.exp !== "undefined") {
                    this.exp = that.exp;
                }

                if (typeof that.a === "undefined") {
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

                if (settings.fractal === "glynn_all" || settings.fractal === "julia_quadratic") {
                    this.cRe = generateValue(null, settings.structure.cRe, settings.fractal);
                    if (settings.fractal === "julia_quadratic") {
                        this.cIm = generateValue(null, settings.structure.cIm, settings.fractal);
                    } else {
                        this.exp = generateValue(null, settings.structure.exp, settings.fractal);
                    }
                }

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
        this.iterationMax = generateValue(this.iterationMax, structure.iterationMax, settings.fractal);
    if (Math.random() <= structure.zoom.chance)
        this.zoom = generateValue(this.zoom, structure.zoom, settings.fractal);
    if (Math.random() <= structure.moveX.chance)
        this.moveX = generateValue(this.moveX, structure.moveX, settings.fractal);
    if (Math.random() <= structure.moveY.chance)
        this.moveY = generateValue(this.moveY, structure.moveY, settings.fractal);

    if (settings.fractal === "glynn_all" || settings.fractal === "julia_quadratic") {
        if (Math.random() <= structure.cRe.chance)
            this.cRe = generateValue(this.cRe, structure.cRe, settings.fractal);
        if (settings.fractal === "julia_quadratic") {
            if (Math.random() <= structure.cIm.chance)
                this.cIm = generateValue(this.cIm, structure.cIm, settings.fractal);
        } else {
            if (Math.random() <= structure.exp.chance)
                this.exp = generateValue(this.exp, structure.exp, settings.fractal);
        }
    }

    if (settings.color === "pallete") {
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
            this.redStart = generateValue(this.redStart, structure.redStart, settings.fractal);
        if (Math.random() <= structure.greenStart.chance)
            this.greenStart = generateValue(this.greenStart, structure.greenStart, settings.fractal);
        if (Math.random() <= structure.blueStart.chance)
            this.blueStart = generateValue(this.blueStart, structure.blueStart, settings.fractal);
        if (Math.random() <= structure.redSpeed.chance)
            this.redSpeed = generateValue(this.redSpeed, structure.redSpeed, settings.fractal);
        if (Math.random() <= structure.greenSpeed.chance)
            this.greenSpeed = generateValue(this.greenSpeed, structure.greenSpeed, settings.fractal);
        if (Math.random() <= structure.blueSpeed.chance)
            this.blueSpeed = generateValue(this.blueSpeed, structure.blueSpeed, settings.fractal);
    }
};


/**
 * Generate new value in chromosone
 * @param {number} oldValue
 * @param {Object} structure
 * @param {string} fractal
 * @returns {number | Object}
 */
function generateValue(oldValue, structure, fractal) {
    if (structure.type === "vec3") {
        return new Vec3();
    }
    var result = 0;
    var from = structure.limit[fractal].min;
    var range = Math.abs(structure.limit[fractal].min) + Math.abs(structure.limit[fractal].max);
    var to = from + range;
    if (structure.method === "random" || oldValue === null) {
        if (structure.method === "random" && structure.distribution === "exp") {
            result = randomExp(from, to);
        } else {
            result = random(from, to);
        }
    } else {
        do {
            result = oldValue + (Math.random() * range * random(-structure.intensity, structure.intensity));
        } while (result < structure.limit[fractal].min || result > structure.limit[fractal].max);
    }

    if (structure.type === "integer")
        result = Math.round(result);

    return result;
}

/**
 *
 * @param {Object} a chromosone
 * @param {Object} b chromosone
 * @param {Object} settings
 * @returns {boolean} true if a and b are same chromosones, false otherwise
 */
function equalChromosones(a, b, settings) {
    //test common
    if (a.iterationMax !== b.iterationMax || a.zoom !== b.zoom || a.moveX !== b.moveX || a.moveY !== b.moveY)
        return false;

    //test special
    if (settings.fractal === "julia_quadratic") {
        if (a.cRe !== b.cRe || a.cIm !== b.cIm)
            return false;
    } else if (settings.fractal === "glynn_all") {
        if (a.cRe !== b.cRe || a.exp !== b.exp)
            return false;
    }

    //test colors
    if (settings.color === "pallete" && (!a.a.equals(b.a) || !a.b.equals(b.b) || !a.c.equals(b.c) || !a.d.equals(b.d))) {
        return false;
    } else if (a.redStart !== b.redStart ||
        a.greenStart !== b.greenStart ||
        a.blueStart !== b.blueStart ||
        a.redSpeed !== b.redSpeed ||
        a.greenSpeed !== b.greenSpeed ||
        a.blueSpeed !== b.blueSpeed) {
        return false;
    }

    return true;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate random number with exponential distribution
 * @param {number} min
 * @param {number} max
 * @returns {number} random number between min and max with exponential distribution
 */
function randomExp(min, max) {
    return Math.pow(Math.random(), 2) * (max - min) + min;
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

function pallete(i, a, b, c, d) {
    if (typeof i !== "number" && typeof a !== "object" && typeof b !== "object" && typeof c !== "object" && typeof d !== "object") {
        throw new TypeError("pallete wrong arguments", "vector.js");
    }
    //return a + b*cos(2PI*(c*t+d));
    return new Vec3(c).mul(i).add(d).mul(Math.PI * 2).cos().mul(b).add(a).toRGB(); // My life is whole
}

var evo = {
    canvas: [],
    generated: 0,
    worker: [],
    palleter: [],
    entropy: [],
    selected: null,
    lock: false,
    checkRequirements: function () {
        if (typeof(Storage) === "undefined") {
            alert("This browser doesn't support localstorage needed for application run.");
            return false;
        }

        if (typeof(Worker) === "undefined") {
            alert("This browser doesn't support Web Worker needed for application run.");
            return false;
        }
        return true;
    },
    init: function () {
        if (!this.lock) {
            this.lock = true;
            this.ui.init();

            for (var i = 0; i < 9; i++) {
                this.canvas[i] = document.getElementById(i.toString());
                this.canvas[i].height = (this.canvas[i].width / 4) * 3;

                this.worker[i] = new Worker("assets/js/fractaler.js");
                this.worker[i].onmessage = this.processWorkerMessage;
            }

            this.palleter = new Worker("assets/js/palleter.js");
            this.palleter.onmessage = function (e) {
                var canvas = document.getElementById("details-pallete");
                var ctx = canvas.getContext('2d');
                var imageData = ctx.createImageData(canvas.width, canvas.height);
                imageData.data.set(e.data.imageData);
                ctx.putImageData(imageData, 0, 0);
            };
            this.lock = false;

            this.generate();
            this.hideSelect();
        }
    },
    generateNew: function () {
        if (this.lock) {
            alert("Please wait until new fractals are generated before reseting.");
        } else {
            this.ui.resetIteration();
            this.hideSelect();
            this.generate();
        }
    },
    generate: function () {
        if (!this.lock) {
            this.lock = true;
            $(".hiddable").addClass("hidden");
            $("#" + this.selected).parent().addClass("locked");
            this.generated = 0;
            this.ui.updateCounter();

            for (var i = 0; i < 9; i++) {
                if (i == this.selected) {
                    this.generated++;
                    this.ui.updateCounter();
                    continue;
                }
                this.generateFractal(i);
            }

            this.settings.iteration++;
            this.ui.updateIterator();
        }
    },
    generateFractal: function (id) {
        if (this.selected === null) { // generate new one
            this.settings.chromosone[id] = new Chromosone(this.settings);
        } else {
            var chromosone = new Chromosone(this.settings.chromosone[this.selected]);

            while (equalChromosones(this.settings.chromosone[this.selected], chromosone, this.settings)) {
                chromosone.mutate(this.settings);
            }
            this.settings.chromosone[id] = chromosone;
        }

        this.drawChromosone(id, null, null);
    },
    drawChromosone: function (id, width, height, hd) {
        hd = typeof  hd === "undefined" ? false : hd;
        var chromosone = new Chromosone(this.settings.chromosone[id]);
        chromosone.fractalId = hd ? "hd" : id;
        chromosone.width = (width === null) ? this.canvas[id].width : width;
        chromosone.height = (height === null) ? this.canvas[id].height : height;
        chromosone.fractal = this.settings.fractal;
        chromosone.color = this.settings.color;
        chromosone.start = new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart);
        chromosone.speed = new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed);
        this.worker[hd ? 0 : id].postMessage(chromosone);
    },
    drawCustomChromosone: function (chromosone) {
        evo.worker[0].postMessage(chromosone);
    },
    select: function (id) {
        if (!this.lock) {
            if (id == this.selected) {//unselect
                this.hideSelect();
            } else {//select
                if (this.selected !== null) {
                    $("#" + this.selected).parent().removeClass("active");
                }
                this.selected = id;
                $("#" + id).parent().addClass("active");


                this.ui.details.empty();
                var ul = $('<table style="margin: 0 auto;"></table>').appendTo(this.ui.details);
                var chromosone = this.settings.chromosone[this.selected];
                ul.append("<tr><td class='table-label'>Iterations</td><td>" + chromosone.iterationMax + "</td></tr>");
                ul.append("<tr><td class='table-label'>Zoom</td><td>" + chromosone.zoom.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>X</td><td>" + chromosone.moveX.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>Y</td><td>" + chromosone.moveY.toFixed(4) + "</td></tr>");
                if(typeof chromosone.cRe !== "undefined") {
                    ul.append("<tr><td class='table-label'>cRe</td><td>" + chromosone.cRe.toFixed(4) + "</td></tr>");
                }
                if(typeof chromosone.cIm !== "undefined") {
                    ul.append("<tr><td class='table-label'>cIm</td><td>" + chromosone.cIm.toFixed(4) + "</td></tr>");
                }
                if(typeof chromosone.exp !== "undefined") {
                    ul.append("<tr><td class='table-label'>Exp</td><td>" + chromosone.exp.toFixed(4) + "</td></tr>");
                }
                ul.append("<tr><td class='table-label'>Pallete</td><td><canvas class='pallete' id='details-pallete'></canvas></td></tr>");
                var canvas = document.getElementById('details-pallete');
                var msg;
                if (this.settings.color === "pallete") {
                    msg = {
                        width: canvas.width,
                        height: canvas.height,
                        color: evo.settings.color,
                        iterations: chromosone.iterationMax,
                        a: chromosone.a,
                        b: chromosone.b,
                        c: chromosone.c,
                        d: chromosone.d
                    };
                } else {
                    msg = {
                        width: canvas.width,
                        height: canvas.height,
                        color: evo.settings.color,
                        iterations: chromosone.iterationMax,
                        start: new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart),
                        speed: new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed)
                    };
                }
                this.palleter.postMessage(msg);
                ul.append("<tr><td class='table-label'>Entropy</td><td>" + this.entropy[this.selected].toFixed(4) + "</td></tr>");
                $(".hiddable").removeClass("hidden");

                this.ui.command.innerHTML = "";
            }
        }
    },
    hideSelect: function () {
        if (this.selected !== null)
            $("#" + this.selected).parent().removeClass("active");

        $(".hiddable").addClass("hidden");
        this.ui.command.innerHTML = "Select fractal you like";
        this.selected = null;
    },
    processWorkerMessage: function (e) {
        //console.log("hey " + e.data.fractalId);
        var ctx;
        var imageData;
        if (e.data.fractalId != "hd") {
            //is fractal good enough?
            if (e.data.entropy <= evo.settings.entropyLimit) {
                evo.generateFractal(e.data.fractalId); //generate new one
            } else {
                evo.entropy[e.data.fractalId] = e.data.entropy;
                ctx = evo.canvas[e.data.fractalId].getContext('2d');
                imageData = ctx.createImageData(evo.canvas[e.data.fractalId].width, evo.canvas[e.data.fractalId].height);
                imageData.data.set(e.data.imageData);
                ctx.putImageData(imageData, 0, 0);

                evo.generated++; // good continue
                evo.ui.updateCounter();
                if (evo.generated == 9) {
                    $("#" + evo.selected).parent().removeClass("locked");
                    evo.hideSelect();
                    evo.lock = false;
                    evo.generated = 0;
                }
            }
        } else {
            var canvas = document.createElement('canvas');
            canvas.width = e.data.width;
            canvas.height = e.data.height;
            ctx = canvas.getContext('2d');
            imageData = ctx.createImageData(canvas.width, canvas.height);
            imageData.data.set(e.data.imageData);
            ctx.putImageData(imageData, 0, 0);
            evo.ui.popupWindow.location.href = canvas.toDataURL('image/png');
        }
    }
};

window.onload = function () {
    if (evo.checkRequirements()) {
        evo.init();
    }
};

window.addEventListener('resize', function () {
    if (screen.width === window.innerWidth) {
        evo.ui.isFullScreen();
    }
});

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

evo.save = function () {
    localStorage.setObject("settings", jQuery.extend(true, {}, evo.settings));
    evo.ui.load.removeClass("hide");
};

evo.load = function () {
    if (!evo.lock) {
        evo.lock = true;
        if (this.checkSave()) {
            evo.settings = localStorage.getObject("settings");
            evo.hideSelect();

            for (var i = 0; i < 9; i++) {
                evo.drawChromosone(i);
            }

            evo.ui.update();
        }
    }
};

evo.checkSave = function () {
    return (localStorage.getObject("settings"));
};
evo.settings = {
    /**
     * Chromosone structure as follows
     * iterationMax
     * zoom
     * moveX
     * moveY
     * redStart
     * greenStart
     * blueStart
     * redSpeed
     * greenSpeed
     * blueSpeed
     * a
     * b
     * c
     * d
     */
    chromosone: [],
    structure: {
        iterationMax: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 100,
                    max: 3000
                },
                mandelbroot_cubic: {
                    min: 100,
                    max: 500
                },
                julia_quadratic: {
                    min: 100,
                    max: 3000
                },
                glynn_all: {
                    min: 100,
                    max: 500
                }
            },
            include: function () {
                return true;
            }
        },
        zoom: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                mandelbroot_quadratic: {
                    min: 1,
                    max: 100
                },
                mandelbroot_cubic: {
                    min: 1,
                    max: 100
                },
                julia_quadratic: {
                    min: 1,
                    max: 10
                },
                glynn_all: {
                    min: 1,
                    max: 20
                }
            },
            include: function () {
                return true;
            }
        },
        moveX: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                mandelbroot_quadratic: {
                    min: -0.75,
                    max: 0.75
                },
                mandelbroot_cubic: {
                    min: -0.5,
                    max: 0.5
                },
                julia_quadratic: {
                    min: -1,
                    max: 1
                },
                glynn_all: {
                    min: -1,
                    max: 1
                }
            },
            include: function () {
                return true;
            }
        },
        moveY: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                mandelbroot_quadratic: {
                    min: -0.75,
                    max: 0.75
                },
                mandelbroot_cubic: {
                    min: -1,
                    max: 1
                },
                julia_quadratic: {
                    min: -1,
                    max: 1
                },
                glynn_all: {
                    min: -1,
                    max: 1
                }
            },
            include: function () {
                return true;
            }
        },
        cRe: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                julia_quadratic: {
                    min: -1,
                    max: 1
                },
                glynn_all: {
                    min: -0.5,
                    max: 0.5
                }
            },
            include: function () {
                return (evo.settings.fractal === "glynn_all" || evo.settings.fractal === "julia_quadratic");
            }
        },
        cIm: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                julia_quadratic: {
                    min: 0,
                    max: 1
                }
            },
            include: function () {
                return evo.settings.fractal === "julia_quadratic";
            }
        },
        exp: {
            method: "step",
            intensity: 1.0,
            type: "float",
            chance: 0.6,
            limit: {
                glynn_all: {
                    min: 1,
                    max: 2
                }
            },
            include: function () {
                return evo.settings.fractal === "glynn_all";
            }
        },
        redStart: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 255
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 255
                },
                julia_quadratic: {
                    min: 0,
                    max: 255
                },
                glynn_all: {
                    min: 0,
                    max: 255
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        greenStart: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 255
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 255
                },
                julia_quadratic: {
                    min: 0,
                    max: 255
                },
                glynn_all: {
                    min: 0,
                    max: 255
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        blueStart: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 255
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 255
                },
                julia_quadratic: {
                    min: 0,
                    max: 255
                },
                glynn_all: {
                    min: 0,
                    max: 255
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        redSpeed: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: -4,
                    max: 4
                },
                mandelbroot_cubic: {
                    min: -4,
                    max: 4
                },
                julia_quadratic: {
                    min: -4,
                    max: 4
                },
                glynn_all: {
                    min: -4,
                    max: 4
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        greenSpeed: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: -4,
                    max: 4
                },
                mandelbroot_cubic: {
                    min: -4,
                    max: 4
                },
                julia_quadratic: {
                    min: -4,
                    max: 4
                },
                glynn_all: {
                    min: -4,
                    max: 4
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        blueSpeed: {
            method: "random",
            distribution: "uniform",
            type: "integer",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: -4,
                    max: 4
                },
                mandelbroot_cubic: {
                    min: -4,
                    max: 4
                },
                julia_quadratic: {
                    min: -4,
                    max: 4
                },
                glynn_all: {
                    min: -4,
                    max: 4
                }
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        a: {
            type: "vec3",
            method: "random",
            distribution: "uniform",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 1
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 1
                },
                julia_quadratic: {
                    min: 0,
                    max: 1
                },
                glynn_all: {
                    min: 0,
                    max: 1
                }
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        b: {
            type: "vec3",
            method: "random",
            distribution: "uniform",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 1
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 1
                },
                julia_quadratic: {
                    min: 0,
                    max: 1
                },
                glynn_all: {
                    min: 0,
                    max: 1
                }
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        c: {
            type: "vec3",
            method: "random",
            distribution: "uniform",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 1
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 1
                },
                julia_quadratic: {
                    min: 0,
                    max: 1
                },
                glynn_all: {
                    min: 0,
                    max: 1
                }
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        d: {
            type: "vec3",
            method: "random",
            distribution: "uniform",
            chance: 0.45,
            limit: {
                mandelbroot_quadratic: {
                    min: 0,
                    max: 1
                },
                mandelbroot_cubic: {
                    min: 0,
                    max: 1
                },
                julia_quadratic: {
                    min: 0,
                    max: 1
                },
                glynn_all: {
                    min: 0,
                    max: 1
                }
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        }
    },
    // Defaults
    entropyLimit: 7.0,
    fractal: "mandelbroot_quadratic",
    color: "simple",
    debugMode: true,
    iteration: 0
};
evo.ui = {
    iterationSpan: null,
    command: null,
    details: null,
    settings: null,
    load: null,
    custom: null,
    popupWindow: null,
    customForm: null,
    init: function () {
        this.iterationSpan = document.getElementById('iteration');
        this.command = document.getElementById("command");
        this.details = $("#details");
        this.settings = $("#settingsDialog");
        this.load = $("#load");
        this.custom = $("#saveCustomDialog");
        this.customForm = $("#saveCustom");
        this.update();
    },
    update: function () {
        if(evo.settings.debugMode) {
            $('.debug[class=hide]').removeClass('hide');
        } else {
            $('.debug[class!=hide]').addColor('hide');
        }

        if (!evo.checkSave()) {
            this.load.addClass("hide");
        }

        evo.ui.updateIterator();
    },
    openSettings: function () {
        if (evo.lock) {
            alert("Please wait until fractals are generated");
        } else {
            $('#color[name=color][value=' + evo.settings.color + ']').prop("checked", true);
            $('#fractal[name=color][value=' + evo.settings.fractal + ']').prop("checked", true);
            $('#debug_mode').prop("checked", evo.settings.debugMode);
            this.settings.modal('show');
        }
    },
    saveSettings: function () {
        var newColor = $('input[name=color]:checked', '#settingsDialog').val();
        var newFractal = $('input[name=fractal]:checked', '#settingsDialog').val();
        var regenerate = false;
        if (newColor != evo.settings.color) {
            evo.settings.color = newColor;
            regenerate = true;
        }
        if (newFractal != evo.settings.fractal) {
            evo.settings.fractal = newFractal;
            regenerate = true;
        }

        evo.settings.debugMode = $('#debug_mode').is(":checked");
        if(evo.settings.debugMode) {
            this.update();
        }

        if (regenerate) {
            evo.generateNew();
        }
    },
    openCustom: function () {
        if (evo.lock) {
            alert("Please wait until fractals are generated");
        } else {
            this.custom.modal('show');
        }
    },
    updateCounter: function () {
        this.command.innerHTML = "Generating " + evo.generated + "/9";
    },
    updateIterator: function () {
        this.iterationSpan.innerHTML = evo.settings.iteration;
    },
    resetIteration: function () {
        evo.settings.iteration = 1;
        this.iterationSpan.innerHTML = evo.settings.iteration;
    },
    isFullScreen: function () {
        // do stuff for full screen
        $(".fullscreen").css("display", "none");
    },
    saveImage: function (width, height) {
        this.popupWindow = window.open('waiting.html', '_blank');
        evo.drawChromosone(evo.selected, width, height, true);
    },
    saveCustom: function () {
        this.popupWindow = window.open('waiting.html', '_blank');
        var chromosone = {};
        chromosone.fractalId = "hd";
        chromosone.iterationMax = parseInt(this.customForm.find('input[name=iterations]').val());
        chromosone.zoom = parseFloat(this.customForm.find('input[name=zoom]').val());
        chromosone.moveX = parseFloat(this.customForm.find('input[name=x]').val());
        chromosone.moveY = parseFloat(this.customForm.find('input[name=y]').val());
        chromosone.cRe = parseFloat(this.customForm.find('input[name=cRe]').val());
        chromosone.cIm = parseFloat(this.customForm.find('input[name=cIm]').val());
        chromosone.exp = parseFloat(this.customForm.find('input[name=exp]').val());
        chromosone.redStart = parseInt(this.customForm.find('input[name=redStart]').val());
        chromosone.greenStart = parseInt(this.customForm.find('input[name=greenStart]').val());
        chromosone.blueStart = parseInt(this.customForm.find('input[name=blueStart]').val());
        chromosone.redSpeed = parseInt(this.customForm.find('input[name=redSpeed]').val());
        chromosone.greenSpeed = parseInt(this.customForm.find('input[name=greenSpeed]').val());
        chromosone.blueSpeed = parseInt(this.customForm.find('input[name=blueSpeed]').val());
        chromosone.width = parseInt(this.customForm.find('input[name=width]').val());
        chromosone.height = parseInt(this.customForm.find('input[name=height]').val());
        chromosone.fractal = this.customForm.find('input[name=fractal]:checked').val();
        chromosone.color = this.customForm.find('input[name=color]:checked').val();
        chromosone.start = new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart);
        chromosone.speed = new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed);
        evo.drawCustomChromosone(chromosone);
    }
};