function AddCityScreen(app, $) {
  var vm = this;
  vm.elements = {
    modal: $('#addCityScreen'),
    cityNameInput: $('#addCityScreen #cityName'),
    closeButton: $('#addCityScreen #closeButton'),
    addButton: $('#addCityScreen #addButton')
  };

  function switchFocus(source, target) {
    source.removeClass('focused').blur();
    target.addClass('focused');
  }

  function left() {
    if(vm.elements.cityNameInput.hasClass('focused')) {
      return;
    }

    vm.elements.addButton.hasClass('focused') ?
      switchFocus(vm.elements.addButton, vm.elements.closeButton) :
      switchFocus(vm.elements.closeButton, vm.elements.addButton);
  }

  function right() {
    left();
  }

  function up() {
    if(vm.elements.cityNameInput.hasClass('focused')) {
      return;
    }

    vm.elements.addButton.hasClass('focused') ?
      switchFocus(vm.elements.addButton, vm.elements.cityNameInput) :
      switchFocus(vm.elements.closeButton, vm.elements.cityNameInput);
  }

  function down() {
    if(vm.elements.addButton.hasClass('focused') || vm.elements.closeButton.hasClass('focused')) {
      return;
    }
    switchFocus(vm.elements.cityNameInput, vm.elements.addButton);
  }

  function enter() {
    $('[data-focus-group] [data-focusable].focused').focus().click();
  }


  function returnAction() {
    vm.elements.modal.hide('fast');
    vm.elements.cityNameInput.val('');
    app.activateScreen(app.screens.main);
  }

  function addCity() {
    app.screens.main.addCity(new City(vm.elements.cityNameInput.val()));
    returnAction();
  }

  return {
    up: up,
    down: down,
    left: left,
    right: right,
    returnAction: returnAction,
    enter: enter,
    addCity: addCity,
    initialize: function() {
      vm.elements.modal.show();
      vm.elements.cityNameInput.addClass('focused');
      vm.elements.cityNameInput.click();
    }
  };
}
