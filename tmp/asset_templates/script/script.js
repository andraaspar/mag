var mag;
(function (mag) {
    var Main = (function () {
        function Main() {
        }
        Main.getInstance = function () {
            return this.instance;
        };
        Main.instance = new Main();
        return Main;
    })();
    mag.Main = Main;
})(mag || (mag = {}));
