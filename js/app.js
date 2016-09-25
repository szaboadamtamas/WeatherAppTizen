function App(window, $, Handlebars) {
  var vm = this;
  vm.screens = {
    main: new MainScreen(this, $, Handlebars),
    addCity: new AddCityScreen(this, $),
    active: {}
  };
  vm.activateScreen = function (screen) {
    vm.screens.active = screen;
    vm.screens.active.initialize();
  };

  function onKeyDown(e) {
    switch (e.keyCode) {
      case 37: //LEFT arrow
        vm.screens.active.left();
        break;
      case 38: //UP arrow
        vm.screens.active.up();
        break;
      case 39: //RIGHT arrow
        vm.screens.active.right();
        break;
      case 40: //DOWN arrow
        vm.screens.active.down();
        break;
      case 18: //Enter button
      case 13: //OK button
        vm.screens.active.enter();
        break;
      case 10009: //RETURN button
        vm.screens.active.returnAction();
        break;
      default:
        console.log("Key code : " + e.keyCode);
        break;
    }
  }

  function onDeviceReady() {
    $(window.document).keydown(onKeyDown);
    vm.screens.main.initialize();
  }

  return {
    initialize: function () {
      window.onload = onDeviceReady;
      vm.screens.active = vm.screens.main;
    },
    screens: vm.screens
  }
}

var app = new App(window, jQuery, Handlebars);
app.initialize();

/// HandleBar helpers ...
Handlebars.registerHelper('celsius', function (kelvin) {
  return (parseFloat(kelvin) - 273.15).toFixed(2);
});
