evo.ui = {
    iterationSpan: null,
    command: null,
    details: null,
    settings: null,
    load: null,
    custom: null,
    popupWindow: null,
    customForm: null,
    hiddable: null,
    lockable: null,
    spinner: [],
    init: function () {
        this.iterationSpan = document.getElementById('iteration');
        this.command = document.getElementById("command");
        this.details = $("#details");
        this.settings = $("#settingsDialog");
        this.load = $("#load");
        this.custom = $("#saveCustomDialog");
        this.customForm = $("#saveCustom");
        this.hiddable = $(".hiddable");
        this.lockable = $(".lockable");

        for (var i = 0; i < 9; i++) {
            this.spinner[i] = new Spinner();
        }

        this.update();
    },
    clearCanvas: function (id) {
        var ctx = evo.canvas[id].getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, evo.canvas[id].width, evo.canvas[id].height);
    },
    update: function () {
        if (evo.settings.debugMode) {
            $('.debug[class=hide]').removeClass('hide');
        } else {
            $('.debug[class!=hide]').addClass('hide');
        }

        if (!evo.settings.checkSave()) {
            this.load.addClass("hide");
        }

        evo.ui.updateIterator();
    },
    openSettings: function () {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
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
        if (newColor !== evo.settings.color) {
            evo.settings.color = newColor;
            regenerate = true;
        }
        if (newFractal !== evo.settings.fractal) {
            evo.settings.fractal = newFractal;
            regenerate = true;
        }

        evo.settings.debugMode = $('#debug_mode').is(":checked");
        if (evo.settings.debugMode) {
            this.update();
        }

        if (regenerate) {
            evo.generateNew();
        }
    },
    openCustom: function () {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
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
        evo.drawChromosone(evo.selected, width, height, "hd");
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
        chromosone.resolution = new Vec2(chromosone.width, chromosone.height);
        chromosone.fractal = this.customForm.find('input[name=fractal]:checked').val();
        chromosone.color = this.customForm.find('input[name=color]:checked').val();
        chromosone.start = new Vec3(chromosone.redStart, chromosone.greenStart, chromosone.blueStart);
        chromosone.speed = new Vec3(chromosone.redSpeed, chromosone.greenSpeed, chromosone.blueSpeed);
        evo.drawCustomChromosone(chromosone);
    },
    addAlertMessage: function(alertType, header, message) {
        var alert = $('<div class="alert alert-dismissable fade-in"></div>');
        alert.addClass(alertType);
        alert.append('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
        alert.append('<strong>' + header + '</strong> ' + message);
        $('#alert-overlay').prepend(alert);
    }
};