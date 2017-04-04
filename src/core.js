var evo = {
    canvas: [],
    generated: 0,
    worker: [],
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
        if (this.selected === null) {
            this.settings.chromosone[id] = {
                iterationMax: this.generateValue(null, this.settings.structure.iterationMax),
                zoom: this.generateValue(null, this.settings.structure.zoom),
                moveX: this.generateValue(null, this.settings.structure.moveX),
                moveY: this.generateValue(null, this.settings.structure.moveY)
            };
            if (this.settings.color === "pallete") {
                this.settings.chromosone[id].a = this.generateValue(null, this.settings.structure.a);
                this.settings.chromosone[id].b = this.generateValue(null, this.settings.structure.b);
                this.settings.chromosone[id].c = this.generateValue(null, this.settings.structure.c);
                this.settings.chromosone[id].d = this.generateValue(null, this.settings.structure.d);
            } else {
                this.settings.chromosone[id].redStart = this.generateValue(null, this.settings.structure.redStart);
                this.settings.chromosone[id].greenStart = this.generateValue(null, this.settings.structure.greenStart);
                this.settings.chromosone[id].blueStart = this.generateValue(null, this.settings.structure.blueStart);
                this.settings.chromosone[id].redSpeed = this.generateValue(null, this.settings.structure.redSpeed);
                this.settings.chromosone[id].greenSpeed = this.generateValue(null, this.settings.structure.greenSpeed);
                this.settings.chromosone[id].blueSpeed = this.generateValue(null, this.settings.structure.blueSpeed);
            }
        } else {
            var chromosone = jQuery.extend(true, {}, this.settings.chromosone[this.selected]);
            var structure = this.settings.structure;

            while (equalChromosones(this.settings.chromosone[this.selected], chromosone, this.settings.color)) {
                if (Math.random() <= structure.iterationMax.chance)
                    chromosone.iterationMax = this.generateValue(chromosone.iterationMax, structure.iterationMax);
                if (Math.random() <= structure.zoom.chance)
                    chromosone.zoom = this.generateValue(chromosone.zoom, structure.zoom);
                if (Math.random() <= structure.moveX.chance)
                    chromosone.moveX = this.generateValue(chromosone.moveX, structure.moveX);
                if (Math.random() <= structure.moveY.chance)
                    chromosone.moveY = this.generateValue(chromosone.moveY, structure.moveY);
                if (this.settings.color === "pallete") {
                    if (Math.random() <= structure.a.chance)
                        chromosone.a = new Vec3();
                    if (Math.random() <= structure.b.chance)
                        chromosone.b = new Vec3();
                    if (Math.random() <= structure.c.chance)
                        chromosone.c = new Vec3();
                    if (Math.random() <= structure.d.chance)
                        chromosone.d = new Vec3();

                } else {
                    if (Math.random() <= structure.redStart.chance)
                        chromosone.redStart = this.generateValue(chromosone.redStart, structure.redStart);
                    if (Math.random() <= structure.greenStart.chance)
                        chromosone.greenStart = this.generateValue(chromosone.greenStart, structure.greenStart);
                    if (Math.random() <= structure.blueStart.chance)
                        chromosone.blueStart = this.generateValue(chromosone.blueStart, structure.blueStart);
                    if (Math.random() <= structure.redSpeed.chance)
                        chromosone.redSpeed = this.generateValue(chromosone.redSpeed, structure.redSpeed);
                    if (Math.random() <= structure.greenSpeed.chance)
                        chromosone.greenSpeed = this.generateValue(chromosone.greenSpeed, structure.greenSpeed);
                    if (Math.random() <= structure.blueSpeed.chance)
                        chromosone.blueSpeed = this.generateValue(chromosone.blueSpeed, structure.blueSpeed);
                }
            }
            this.settings.chromosone[id] = chromosone;
        }

        this.drawChromosone(id, null, null);
    },
    generateValue: function (oldValue, structure) {
        if (structure.type === "vec3") {
            return new Vec3();
        }
        var result = 0;
        var from = structure.min;
        var range = (Math.abs(structure.min) + Math.abs(structure.max)) * structure.limit[this.settings.fractal];
        var to = from + range;
        if (structure.method === "random" || oldValue === null) {
            result = random(from, to);
        } else {
            do {
                result = oldValue + (Math.random() * range * random(-structure.intensity, structure.intensity));
            } while (result < structure.min || result > structure.max);
        }

        if (structure.type === "integer")
            result = Math.round(result);

        return result;
    },
    drawChromosone: function (id, width, height) {
        var chromosone = jQuery.extend(true, {}, this.settings.chromosone[id]);
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
                ul.append("<tr><td class='table-label'>Iterations</td><td>" + this.settings.chromosone[this.selected].iterationMax + "</td></tr>");
                ul.append("<tr><td class='table-label'>Zoom</td><td>" + this.settings.chromosone[this.selected].zoom.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>X</td><td>" + this.settings.chromosone[this.selected].moveX.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>Y</td><td>" + this.settings.chromosone[this.selected].moveY.toFixed(4) + "</td></tr>");
                ul.append("<tr><td class='table-label'>Red start</td><td>" + this.settings.chromosone[this.selected].redStart + "</td></tr>");
                ul.append("<tr><td class='table-label'>Green start</td><td>" + this.settings.chromosone[this.selected].greenStart + "</td></tr>");
                ul.append("<tr><td class='table-label'>Blue Start</td><td>" + this.settings.chromosone[this.selected].blueStart + "</td></tr>");
                ul.append("<tr><td class='table-label'>Red speed</td><td>" + this.settings.chromosone[this.selected].redSpeed + "</td></tr>");
                ul.append("<tr><td class='table-label'>Green speed</td><td>" + this.settings.chromosone[this.selected].greenSpeed + "</td></tr>");
                ul.append("<tr><td class='table-label'>Blue speed</td><td>" + this.settings.chromosone[this.selected].blueSpeed + "</td></tr>");
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
