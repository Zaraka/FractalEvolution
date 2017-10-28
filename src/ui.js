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
    exportDialog: null,
    exportData: null,
    importDialog: null,
    importData: null,
    saveManagerDialog: null,
    saveManagerTableBody: null,
    saveName: null,
    loadManagerDialog: null,
    loadManagerTableBody: null,
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
        this.exportDialog = $("#exportDialog");
        this.exportData = $("#exportData");
        this.importDialog = $("#importDialog");
        this.importData = $("#importData");
        this.saveManagerDialog = $("#saveManagerDialog");
        this.saveName = $("#saveName");
        this.saveManagerTableBody = $("#saveManagerTableBody");
        this.loadManagerDialog = $("#loadManagerDialog");
        this.loadManagerTableBody = $("#loadManagerTableBody");

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
        }

        this.custom.modal('show');
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
    openExport: function() {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
            return;
        }

        this.exportData.val(JSON.stringify(evo.settings.prepareSaveObject()));
        this.exportDialog.modal('show');
    },
    openImport: function() {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
            return;
        }

        this.importDialog.modal('show');
    },
    onImportData: function() {
        evo.settings.load(JSON.parse(this.importData.val()));
    },
    openSaveManager: function() {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
            return;
        }

        this.saveManagerTableBody.find("tr").remove();

        var saves = evo.settings.getSavedObjects();
        for(var i = 0; i < saves.length; i++) {
            this.saveManagerTableBody
                .append('<tr style="cursor: pointer" class="saveRow" onclick="$(\'#saveName\').val(\''+ saves[i].name + '\');">' +
                    '<td>' + (i+1) + '</td>>' +
                    '<td>' + saves[i].name + '</td></tr>');
        }

        this.saveManagerDialog.modal('show');
    },
    onNewSave: function() {
        evo.settings.saveToLocalStorage(this.saveName.val());
    },
    openLoadManager: function() {
        if (evo.lock) {
            this.addAlertMessage(
                "alert-danger", "Error!", "Please wait until fractals are generated");
            return;
        }

        this.loadManagerTableBody.find("tr").remove();

        var saves = evo.settings.getSavedObjects();
        for(var i = 0; i < saves.length; i++) {
            this.loadManagerTableBody
                .append('<tr data-dismiss="modal" style="cursor: pointer" class="saveRow" onclick="evo.ui.onLoad(\'' + i + '\');">' +
                    '<td>' + (i+1) + '</td>>' +
                    '<td>' + saves[i].name + '</td></tr>');
        }

        this.loadManagerDialog.modal('show');
    },
    onLoad: function (saveIndex) {
        evo.settings.loadFromLocalStorage(saveIndex);
    },
    addAlertMessage: function(alertType, header, message) {
        var alert = $('<div class="alert alert-dismissable fade-in"></div>');
        alert.addClass(alertType);
        alert.append('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
        alert.append('<strong>' + header + '</strong> ' + message);

        $('#alert-overlay').prepend(alert);

        $(alert).fadeTo(6000, 500).slideUp(500, function(){
            $(alert).alert('close');
        });
    }
};