function MainScreen(app, $, Handlebars) {
  var vm = this;
  vm.cities = [
    new City('Budapest'),
    new City('Berlin')
  ];

  vm.templates = {
    cityList: Handlebars.compile($('#city-list-template').html()),
    selectedCity: Handlebars.compile($('#selected-city-template').html())
  };

  function getFocusedItem() {
    return $('[data-focus-group] [data-focusable].focused');
  }

  function getSelectedItem() {
    return $('[data-focus-group] [data-focusable].selected');
  }

  function up() {
    var currentItem = getFocusedItem();
    var previousItem = currentItem.removeClass('focused').prev('[data-focusable]');

    if (previousItem.length) {
      previousItem.addClass('focused');
    } else {
      currentItem.siblings().last().addClass('focused');
    }
  }

  function down() {
    var currentItem = getFocusedItem();
    var nextItem = currentItem.removeClass('focused').next('[data-focusable]');

    if (nextItem.length) {
      nextItem.addClass('focused');
    } else {
      currentItem.siblings().first().addClass('focused');
    }
  }

  function enter() {
    getFocusedItem().click();
  }

  function select(element) {
    getSelectedItem().removeClass('selected');
    getFocusedItem().removeClass('focused');
    $(element).addClass('selected focused');
  }

  function selectCity(element, cityIndex) {
    $('#selected-city-container').html(vm.templates.selectedCity(vm.cities[cityIndex]));
    select(element);
  }

  function openAddCityScreen(element) {
    select(element);
    app.activateScreen(app.screens.addCity);
  }

  function addCity(city) {
    vm.cities.push(city);
    render();
  }

  function loadCitiesData() {
    var tasks = [];
    vm.cities.forEach(function (city) {
      tasks.push(city.loadData());
    });

    $.when.apply($, tasks).done(render);
  }

  function render() {
    $('#city-list-container').html(vm.templates.cityList({cities: vm.cities}));
    $('#selected-city-container').html(vm.templates.selectedCity(vm.cities[0]));

    //Select First Item
    $('[data-focus-group] [data-focusable]').first().addClass('focused selected');
  }

  return {
    up: up,
    down: down,
    left: function () {},
    right: function () {},
    return: function () {},
    enter: enter,
    selectCity: selectCity,
    openAddCityScreen: openAddCityScreen,
    addCity: addCity,
    initialize: function () {
      loadCitiesData();
    }
  };
}
