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
        evo.drawChromosone(evo.selected, width, height);
    },
    saveCustom: function () {
        this.popupWindow = window.open('waiting.html', '_blank');
        var chromosone = {};
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
         */
        chromosone.fractalId = "hd";
        chromosone.iterationMax = parseInt(this.customForm.find('input[name=iterations]').val());
        chromosone.zoom = parseFloat(this.customForm.find('input[name=zoom]').val());
        chromosone.moveX = parseFloat(this.customForm.find('input[name=x]').val());
        chromosone.moveY = parseFloat(this.customForm.find('input[name=y]').val());
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