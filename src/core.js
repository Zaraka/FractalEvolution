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

                this.worker[i] = new Worker("fractaler.js");
                this.worker[i].onmessage = this.processWorkerMessage;
            }

            this.palleter = new Worker("palleter.js");
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

            while (equalChromosones(this.settings.chromosone[this.selected], chromosone, this.settings.color)) {
                chromosone.mutate(this.settings);
            }
            this.settings.chromosone[id] = chromosone;
        }

        this.drawChromosone(id, null, null);
    },
    drawChromosone: function (id, width, height) {
        var chromosone = new Chromosone(this.settings.chromosone[id]);
        chromosone.fractalId = id;
        chromosone.width = (width === null) ? this.canvas[id].width : width;
        chromosone.height = (height === null) ? this.canvas[id].height : height;
        chromosone.fractal = this.settings.fractal;
        chromosone.color = this.settings.color;
        chromosone.start = new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart);
        chromosone.speed = new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed);
        this.worker[id].postMessage(chromosone);
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
                var ul = $('<table></table>').appendTo(this.ui.details);
                var chromosone = this.settings.chromosone[this.selected];
                ul.append("<tr><td class='table-label'>Iterations</td><td>" + chromosone.iterationMax + "</td></tr>");
                ul.append("<tr><td class='table-label'>Zoom</td><td>" + chromosone.zoom.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>X</td><td>" + chromosone.moveX.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>Y</td><td>" + chromosone.moveY.toFixed(4) + "</td></tr>");
                if (this.settings.color === "pallete") {
                    ul.append("<tr><td class='table-label'>Pallete</td><td><canvas class='pallete' id='details-pallete'></canvas></td></tr>");
                    var canvas = document.getElementById('details-pallete');
                    this.palleter.postMessage({
                        width: canvas.width,
                        height: canvas.height,
                        a: chromosone.a,
                        b: chromosone.b,
                        c: chromosone.c,
                        d: chromosone.d
                    });
                } else {
                    ul.append("<tr><td class='table-label'>Red start</td><td>" + chromosone.redStart + "</td></tr>");
                    ul.append("<tr><td class='table-label'>Green start</td><td>" + chromosone.greenStart + "</td></tr>");
                    ul.append("<tr><td class='table-label'>Blue Start</td><td>" + chromosone.blueStart + "</td></tr>");
                    ul.append("<tr><td class='table-label'>Red speed</td><td>" + chromosone.redSpeed + "</td></tr>");
                    ul.append("<tr><td class='table-label'>Green speed</td><td>" + chromosone.greenSpeed + "</td></tr>");
                    ul.append("<tr><td class='table-label'>Blue speed</td><td>" + chromosone.blueSpeed + "</td></tr>");
                }
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
