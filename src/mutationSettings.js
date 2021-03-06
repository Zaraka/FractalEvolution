evo.settings.structure = {
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
                    max: 300
            },
            julia_quadratic: {
                min: 100,
                    max: 3000
            },
            glynn_all: {
                min: 200,
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
                    max: 400
            },
            mandelbroot_cubic: {
                min: 1,
                    max: 300
            },
            julia_quadratic: {
                min: 1,
                    max: 300
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
                min: -1,
                    max: 1,
                    center: -0.5
            },
            mandelbroot_cubic: {
                min: 0.3,
                    max: 0.6,
                    center: -0.25
            },
            julia_quadratic: {
                min: -1,
                    max: 1,
                    center: 0
            },
            glynn_all: {
                min: -1,
                    max: 1,
                    center: 0
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
                min: -1,
                    max: 1,
                    center: 0
            },
            mandelbroot_cubic: {
                min: -0.3,
                    max: 0.3,
                    center: 0
            },
            julia_quadratic: {
                min: -1,
                    max: 1,
                    center: 0
            },
            glynn_all: {
                min: -1,
                    max: 1,
                    center: 0
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
                    max: 0.0
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
                    max: 125
            },
            mandelbroot_cubic: {
                min: 0,
                    max: 125
            },
            julia_quadratic: {
                min: 0,
                    max: 125
            },
            glynn_all: {
                min: 0,
                    max: 125
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
                    max: 125
            },
            mandelbroot_cubic: {
                min: 0,
                    max: 125
            },
            julia_quadratic: {
                min: 0,
                    max: 125
            },
            glynn_all: {
                min: 0,
                    max: 125
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
                    max: 125
            },
            mandelbroot_cubic: {
                min: 0,
                    max: 125
            },
            julia_quadratic: {
                min: 0,
                    max: 125
            },
            glynn_all: {
                min: 0,
                    max: 125
            }
        },
        include: function () {
            return (evo.settings.color !== "pallete");
        }
    },
    redSpeed: {
        method: "random",
            distribution: "uniform",
            type: "floatr",
            chance: 0.45,
            limit: {
            mandelbroot_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            mandelbroot_cubic: {
                min: -2.0,
                    max: 2.0
            },
            julia_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            glynn_all: {
                min: -2.0,
                    max: 2.0
            }
        },
        include: function () {
            return (evo.settings.color !== "pallete");
        }
    },
    greenSpeed: {
        method: "random",
            distribution: "uniform",
            type: "floatr",
            chance: 0.45,
            limit: {
            mandelbroot_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            mandelbroot_cubic: {
                min: -2.0,
                    max: 2.0
            },
            julia_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            glynn_all: {
                min: -2.0,
                    max: 2.0
            }
        },
        include: function () {
            return (evo.settings.color !== "pallete");
        }
    },
    blueSpeed: {
        method: "random",
            distribution: "uniform",
            type: "floatr",
            chance:0.45,
            limit: {
            mandelbroot_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            mandelbroot_cubic: {
                min: -2.0,
                    max: 2.0
            },
            julia_quadratic: {
                min: -2.0,
                    max: 2.0
            },
            glynn_all: {
                min: -2.0,
                    max: 2.0
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
};