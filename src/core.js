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
            this.ui.hiddable.addClass("hidden");
            this.ui.lockable.prop("disabled", true);
            this.ui.lockable.addClass("list-item-disabled");
            var canvas = $("#" + this.selected);
            canvas.parent().addClass("locked");
            this.generated = 0;
            this.ui.updateCounter();

            for (var i = 0; i < 9; i++) {
                if (i === this.selected) {
                    //preserven selected
                    this.generated++;
                    this.ui.updateCounter();
                    continue;
                }
                this.ui.clearCanvas(i);
                this.ui.spinner[i].spin(document.getElementById(i).parentNode);
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
    drawChromosone: function (id, width, height, type) {
        type = typeof  type === "undefined" ? false : type;
        var chromosone = new Chromosone(this.settings.chromosone[id]);
        chromosone.fractalId = type ? type : id;
        chromosone.resolution = new Vec2(
            (width === null) ? this.canvas[id].width : width,
            (height === null) ? this.canvas[id].height : height);
        chromosone.fractal = this.settings.fractal;
        chromosone.color = this.settings.color;
        chromosone.start = new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart);
        chromosone.speed = new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed);
        if (type === "preview") {
            chromosone.limit = new Vec2(
                evo.settings.structure.moveX.limit[this.settings.fractal].center,
                evo.settings.structure.moveY.limit[this.settings.fractal].center
            );
        }
        var receiver = (type === "hd" || type === "preview") ? 0 : id;
        this.worker[receiver].postMessage(chromosone);
    },
    drawCustomChromosone: function (chromosone) {
        evo.worker[0].postMessage(chromosone);
    },
    select: function (id) {
        if (!this.lock) {
            if (id === this.selected) {//unselect
                this.hideSelect();
            } else {//select
                if (this.selected !== null) {
                    $("#" + this.selected).parent().removeClass("active");
                }
                this.selected = id;
                $("#" + id).parent().addClass("active");


                this.ui.details.empty();
                $('<canvas id="preview-canvas" style="width: 150px; height: 150px"></canvas>').appendTo(this.ui.details);
                this.drawChromosone(id, 150, 150, "preview");

                var ul = $('<table style="margin: 0 auto;"></table>').appendTo(this.ui.details);
                var chromosone = this.settings.chromosone[this.selected];
                ul.append("<tr><td class='table-label'>Iterations</td><td>" + chromosone.iterationMax + "</td></tr>");
                ul.append("<tr><td class='table-label'>Zoom</td><td>" + chromosone.zoom.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>X</td><td>" + chromosone.moveX.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>Y</td><td>" + chromosone.moveY.toFixed(4) + "</td></tr>");
                if (typeof chromosone.cRe !== "undefined") {
                    ul.append("<tr><td class='table-label'>cRe</td><td>" + chromosone.cRe.toFixed(4) + "</td></tr>");
                }
                if (typeof chromosone.cIm !== "undefined") {
                    ul.append("<tr><td class='table-label'>cIm</td><td>" + chromosone.cIm.toFixed(4) + "</td></tr>");
                }
                if (typeof chromosone.exp !== "undefined") {
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
                this.ui.hiddable.removeClass("hidden");
                this.ui.lockable.removeClass("list-item-disabled");
                this.ui.lockable.prop("disabled", false);
                this.ui.command.innerHTML = "&nbsp;";
            }
        }
    },
    hideSelect: function () {
        if (this.selected !== null)
            $("#" + this.selected).parent().removeClass("active");

        this.ui.hiddable.addClass("hidden");
        this.ui.lockable.addClass("list-item-disabled");
        this.ui.lockable.prop("disabled", true);
        this.ui.command.innerHTML = "Select fractal you like";
        this.selected = null;
    },
    processWorkerMessage: function (e) {
        var ctx;
        var imageData;
        var canvas;
        if (!isNaN(e.data.fractalId) && isFinite(e.data.fractalId)) {
            //is fractal good enough?
            if (e.data.entropy <= evo.settings.entropyLimit) {
                evo.generateFractal(e.data.fractalId); //generate new one
            } else {
                evo.entropy[e.data.fractalId] = e.data.entropy;
                ctx = evo.canvas[e.data.fractalId].getContext('2d');
                imageData = ctx.createImageData(evo.canvas[e.data.fractalId].width, evo.canvas[e.data.fractalId].height);
                imageData.data.set(e.data.imageData);
                ctx.putImageData(imageData, 0, 0);

                evo.generated++; // good enoug, continue

                evo.ui.spinner[e.data.fractalId].stop();

                evo.ui.updateCounter();
                if (evo.generated === 9) {
                    $("#" + evo.selected).parent().removeClass("locked");
                    evo.hideSelect();
                    evo.lock = false;
                    evo.generated = 0;
                }
            }
        } else if (e.data.fractalId === "hd") {
            canvas = document.createElement('canvas');
            canvas.width = e.data.resolution.x;
            canvas.height = e.data.resolution.y;
            ctx = canvas.getContext('2d');
            imageData = ctx.createImageData(canvas.width, canvas.height);
            imageData.data.set(e.data.imageData);
            ctx.putImageData(imageData, 0, 0);
            evo.ui.popupWindow.location.href = canvas.toDataURL('image/png');
        } else if (e.data.fractalId === "preview") {
            canvas = document.getElementById("preview-canvas");
            canvas.width = e.data.resolution.x;
            canvas.height = e.data.resolution.y;
            ctx = canvas.getContext("2d");
            imageData = ctx.createImageData(e.data.resolution.x, e.data.resolution.y);
            imageData.data.set(e.data.imageData);
            ctx.putImageData(imageData, 0, 0);
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
