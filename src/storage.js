Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

evo.save = function () {
    localStorage.setObject("settings", jQuery.extend(true, {}, evo.settings));
    evo.ui.load.removeClass("hide");
};

evo.load = function () {
    if (!evo.lock) {
        evo.lock = true;
        if (this.checkSave()) {
            evo.settings = localStorage.getObject("settings");
            evo.hideSelect();

            for (var i = 0; i < 9; i++) {
                evo.drawChromosone(i);
            }

            evo.ui.update();
        }
    }
};

evo.checkSave = function () {
    return (localStorage.getObject("settings"));
};