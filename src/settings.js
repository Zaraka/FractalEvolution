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
    // Defaults
    entropyLimit: 7.0,
    fractal: "mandelbroot_quadratic",
    color: "simple",
    debugMode: true,
    iteration: 0,
    save: function () {
        localStorage.setObject("settings", {
                chromosone: evo.settings.chromosone,
                entropyLimit: evo.settings.entropyLimit,
                fractal: evo.settings.fractal,
                color: evo.settings.color,
                iteration: evo.settings.iteration
            });
        evo.ui.load.removeClass("hide");
    },
    load: function () {
        if (!evo.lock) {
            evo.lock = true;
            if (this.checkSave()) {
                var storedSettings = localStorage.getObject("settings");
                this.chromosone = storedSettings.chromosone;
                this.entropyLimit = storedSettings.entropyLimit;
                this.fractal = storedSettings.fractal;
                this.color = storedSettings.color;
                this.iteration = storedSettings.iteration;

                evo.hideSelect();

                for (var i = 0; i < 9; i++) {
                    evo.ui.clearCanvas(i);
                    evo.ui.spinner[i].spin(document.getElementById(i).parentNode);
                    evo.drawChromosone(i, null, null);
                }

                evo.ui.update();
            }
        }
    },
    checkSave: function () {
        return (typeof localStorage.getObject("settings") !== "undefined");
    }
};