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
            type: "integer",
            chance: 0.4,
            min: 100,
            max: 600,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return true;
            }
        },
        zoom: {
            method: "step",
            type: "float",
            chance: 0.6,
            intensity: 1.0,
            min: 1.0,
            max: 100.0,
            limit: {
                quadratic: 1.0,
                cubic: 0.5
            },
            include: function () {
                return true;
            }
        },
        moveX: {
            method: "step",
            type: "float",
            chance: 0.6,
            intensity: 1.0,
            min: -1.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return true;
            }
        },
        moveY: {
            method: "step",
            type: "float",
            chance: 0.6,
            intensity: 1.0,
            min: -1.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return true;
            }
        },
        redStart: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: 0,
            max: 255,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        greenStart: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: 0,
            max: 255,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        blueStart: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: 0,
            max: 255,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        redSpeed: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: -10,
            max: 10,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        greenSpeed: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: -10,
            max: 10,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        blueSpeed: {
            method: "random",
            type: "integer",
            chance: 0.45,
            min: -10,
            max: 10,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color !== "pallete");
            }
        },
        a: {
            type: "vec3",
            method: "random",
            chance: 0.45,
            min: 0.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        b: {
            type: "vec3",
            method: "random",
            chance: 0.45,
            min: 0.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        c: {
            type: "vec3",
            method: "random",
            chance: 0.45,
            min: 0.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        },
        d: {
            type: "vec3",
            method: "random",
            chance: 0.45,
            min: 0.0,
            max: 1.0,
            limit: {
                quadratic: 1.0,
                cubic: 1.0
            },
            include: function () {
                return (evo.settings.color === "pallete");
            }
        }
    },
    // Defaults
    entropyLimit: 5.0,
    fractal: "quadratic",
    color: "simple",
    debugMode: true,
    iteration: 1
};