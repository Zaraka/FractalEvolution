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
    constructor: {
        name: "Settings"
    },
    chromosone: [],
    history: [],
    historyCursor: 0,
    // Defaults
    entropyLimit: 7.0,
    fractal: "mandelbroot_quadratic",
    color: "simple",
    noZoom: false,
    debugMode: true,
    iteration: 0,
    historyInsert: function() {
        this.history = this.history.slice(0, this.history.length);
        this.history.push(JSON.parse(JSON.stringify(this.prepareSaveObject())));
        this.historyCursor = this.history.length - 1;
    },
    historyBackward: function() {
        this.historyCursor--;
        this.load(this.history[this.historyCursor]);
    },
    historyForward: function() {
        this.historyCursor++;
        this.load(this.history[this.historyCursor]);
    },
    clearHistory: function() {
        this.history = [];
        this.historyCursor = 0;
    },
    prepareSaveObject: function () {
        return {
            chromosone: evo.settings.chromosone,
            entropyLimit: evo.settings.entropyLimit,
            fractal: evo.settings.fractal,
            color: evo.settings.color,
            iteration: evo.settings.iteration,
            noZoom: evo.settings.noZoom
        };
    },
    loadSavedObject: function (saveObject) {
        this.chromosone = saveObject.chromosone;
        this.entropyLimit = saveObject.entropyLimit;
        this.fractal = saveObject.fractal;
        this.color = saveObject.color;
        this.iteration = saveObject.iteration;
        this.noZoom = saveObject.noZoom;
    },
    saveToLocalStorage: function (name) {
        var saves = localStorage.getObject("saves");
        if (typeof saves === "undefined" || !Array.isArray(saves))
            saves = [];

        //saves.push({name:this.prepareSaveObject()});
        saves.push({name: name, data: this.prepareSaveObject()});
        console.log(saves);
        localStorage.setObject("saves", saves);
    },
    loadFromLocalStorage: function (i) {
        var saves = localStorage.getObject("saves");
        if (typeof saves === "undefined")
            evo.ui.addAlertMessage("alert-danger", "Error!", "Save not found");

        var save = saves[i].data;

        if (typeof save === "undefined")
            evo.ui.addAlertMessage("alert-danger", "Error!", "Save not found");

        this.load(save);
    },
    load: function (storedSettings) {
        if (!evo.lock && typeof storedSettings !== "undefined") {
            evo.lock = true;
            if (this.checkSave()) {
                this.loadSavedObject(storedSettings);

                evo.ui.hideSelect();
                evo.ui.lockHistory();

                for (var i = 0; i < 9; i++) {
                    evo.ui.clearCanvas(i);
                    evo.ui.spinner[i].spin(document.getElementById(i).parentNode);
                    evo.drawChromosone(i, null, null, true);
                }

                evo.ui.update();
            }
        }
    },
    getSavedObjects: function () {
        var saves = localStorage.getObject("saves");
        if (typeof saves === "undefined" || !Array.isArray(saves))
            return [];

        return saves;
    },
    checkSave: function () {
        return (typeof localStorage.getObject("settings") !== "undefined");
    }
};