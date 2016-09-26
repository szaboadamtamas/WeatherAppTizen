# Weather App Tizen Demo

## 0. lépés, Tizen fejlesztői környezet bemutatása

1. Letöltés: [https://www.samsungdforum.com/TizenDevtools/SdkDownload]
2. Tizen Update Manager bemutatása
3. Tizen IDE
4. Tizen Emulator Manager
	
##	1. lépés, Projekt létrehozás, alap struktúra bemutatása

1. `index.html`
2. `app.js`
3. `model`
4. `screens`
5. `config.xml` beállítása
	1. Widget/Author
	2. Features:
		* tv.inputdevice
		* feature/Keyboard
		* feature/Mouse
	3. Priviliges
		* network.public
		* application.launch
		* tv.inputdevice
		* http://tizen.org/privilege/internet
	4. Policy
		* Network URL: * Allow subdomain: true
	5. Required Version: 2.4
6. __Teszt__

## 2. lépés, Main screen, Városok betöltése

1. City model implementáció

	```
	this.name = name || '';
	this.data = data || {};
	```

	```
	City.prototype.loadData = function () {
	  var self = this;
	  return $.Deferred(function (defer) {
	    $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + self.name + '&APPID=092772ce1a4ecc1ec94acba0e815728f')
	      .done(function (result) {
	        self.data = result;
	        defer.resolve();
	      });
	  });
	};
	```

2. OpenWeather API átnézése
3. Város adatok betöltése

	```
	function loadCitiesData() {
	    var tasks = [];
	    vm.cities.forEach(function (city) {
	      tasks.push(city.loadData());
	    });

	    $.when.apply($, tasks).done(function() {
	    	debugger;
	    });
	 }

	 ...

	 initialize: function () {
	    loadCitiesData();
	}
	```
4. Debugger __Teszt__

##	3. lépés, Main screen, Városok listájának megjelenítése

1. Main Screen HTML template
	
	```
	<div class="app-container">
	  <div class="row">
	    <div class="col-md-5"
	         data-focus-group>
	      <div id="city-list-container"></div>
	    </div>
	    <div id="selected-city-container" class="col-md-6 col-md-offset-1"></div>
	  </div>
	</div>

	<script id="city-list-template" type="text/x-handlebars-template">
	  <ul class="list-group">
	    {{#each cities}}
	    <li class="list-group-item"
	        data-focusable
	        data-city-index="{{@index}}"
	        onclick="app.screens.main.selectCity(this, {{@index}})">
	      <em>{{celsius this.data.main.temp}}&deg;C</em>
	      {{this.name}}<br />
	      <small>{{this.data.sys.country}}</small>
	    </li>
	    {{/each}}
	    <li data-focusable
	        onclick="app.screens.main.openAddCityScreen(this)">
	      <a class="btn btn-default btn-lg btn-block">Add city</a>
	    </li>
	  </ul>
	</script>
	```

2. Template hozzáadása a Main screenhez

	```
	vm.templates = {
 		cityList: Handlebars.compile($('#city-list-template').html()),
	};
	```

3. Render function

	```
	function render() {
	    $('#city-list-container').html(vm.templates.cityList({cities: vm.cities}));

	    //Select First Item
	    $('[data-focus-group] [data-focusable]').first().addClass('focused selected');
	}

	...

	loadCitiesData -> .done(render)
	```
4. __Teszt__

##	4. lépés, Lépkedés a lista elemek között

1. Variáns, nincs kezelve a túllépkedés
	
	```
	function getFocusedItem() {
		return $('[data-focus-group] [data-focusable].focused');
	}


	function up() {
		var currentItem = getFocusedItem();
		var previousItem = currentItem.removeClass('focused').prev('[data-focusable]');

		previousItem.addClass('focused');
	}	

	function down() {
		var currentItem = getFocusedItem();
		var nextItem = currentItem.removeClass('focused').next('[data-focusable]');

		nextItem.addClass('focused');		
	}
	```

2. Up, Down bekötés a MainScreen-be
3. App.js Key handlerek hozzáadása

	```
	vm.screens.active.left();
	```

4. __Teszt__
5. Túlnavigálás kezelése

	```
	if (previousItem.length) {
		previousItem.addClass('focused');
	} else {
		currentItem.siblings().last().addClass('focused');
	}
	```
	Másik irány implementálása is

##	5. lépés, Város adatok megjelenítése

1. HTML template-ek hozzáadása
	```
	<script id="selected-city-template" type="text/x-handlebars-template">
	  <div class="jumbotron app-main">
	    <h2 class="app-main-location">{{name}}
	      <small>{{data.sys.country}}</small>
	      {{#if data.weather}}
	      <small class="pull-right"><i>{{data.weather.0.main}}</i></small>
	      {{/if}}
	    </h2>
	    <h1 class="app-main-degree">{{celsius data.main.temp}}&deg;C</h1>
	    <table class="app-main-table">
	      <tr class="primary">
	        <td>{{data.main.pressure}} hpa</td>
	        <td>{{data.main.humidity}} %</td>
	        <td>{{data.wind.speed}} m/s</td>
	        <td>{{celsius data.main.temp_min}}&deg;C</td>
	        <td>{{celsius data.main.temp_max}}&deg;C</td>
	      </tr>
	      <tr>
	        <td>Press.</td>
	        <td>Hum.</td>
	        <td>Wind</td>
	        <td>Max.</td>
	        <td>Min.</td>
	      </tr>
	    </table>
	  </div>
	  <div class="jumbotron app-sun">
	    <div class="row">
	      <div class="app-sun-icon col-md-2">
	        <i class="fa fa-sun-o"></i>
	      </div>
	      <div class="app-sun-text col-md-5">
	        <i class="fa fa-arrow-up"></i>
	        <span>{{time data.sys.sunrise}}</span>
	      </div>
	      <div class="app-sun-text col-md-5">
	        <i class="fa fa-arrow-down"></i>
	        <span>{{time data.sys.sunset}}</span>
	      </div>
	    </div>
	  </div>
	</script>
	```

2. Template regisztrálása
	
	```
	vm.templates = {
	    cityList: Handlebars.compile($('#city-list-template').html()),
	    selectedCity: Handlebars.compile($('#selected-city-template').html())
	};
	```
	
3. Render-be default city kiírása

	```
	$('#selected-city-container').html(vm.templates.selectedCity(vm.cities[0]));
	```

4. __Teszt__


##	6. lépés, Város Kiválasztás


1. Elem kiválasztása	

	```
	function getSelectedItem() {
		return $('[data-focus-group] [data-focusable].selected');
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
	```
	
2. Bekötni a returnben a selectCity-t
3. __Teszt__
4. Enter hozzáadása

	```
	function enter() {
		getFocusedItem().click();
	}
	```


## 7. lépés, Add City Modal megnyitása

1. HTML Template hozzáadása

	```
	<!-- Add City Screen -->
	<div id="addCityScreen"
	     class="modal"
	     tabindex="-1"
	     role="dialog">
	  <div class="modal-dialog modal-lg"
	       data-focus-group
	       role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h1 class="modal-title">Add New City</h1>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
	          <label for="cityName">City name</label>
	          <input type="text"
	                 data-focusable
	                 class="form-control"
	                 id="cityName"
	                 placeholder="City Name">
	        </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button"
	                id="closeButton"
	                data-focusable
	                class="btn btn danger"
	                onclick="app.screens.addCity.returnAction(this)">Close</button>
	        <button type="submit"
	                id="addButton"
	                data-focusable
	                class="btn btn-primary"
	                onclick="app.screens.addCity.addCity(this); return false;">Add City</button>
	      </div>
	    </div>
	  </div>
	</div>
	<!-- Add City Screen End -->
	```

2. Nyissuk meg a modal window-t

	1. `main.js` - switch screen
		```
		function openAddCityScreen(element) {
			select(element);
			app.activateScreen(app.screens.addCity);
		}
		```

	2. `addCity.js` - return
		```
		initialize: function() {
	      vm.elements.modal.show();
	      vm.elements.cityNameInput.addClass('focused');
	      vm.elements.cityNameInput.click();
	    }
	    ```

3. __Teszt__

## 8. lépés, Add City Modal navigáció
	
1. Navigációs eseméynkezelők

	```
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
	```

2. Eseménykezelők bekötése

	```
	up: up,
    down: down,
    left: left,
    right: left, //Left is now same as Right
    enter: enter,
    ```

3. __Teszt__


##	9. lépés, Visszatérés az Add City modal-hoz
-----------------------------------------------

1. `addCity.js` - visszatérés

	```
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
	```

2. Eseménykezelők bekötése

	```
	returnAction: returnAction,
    addCity: addCity,
    ```

3. AddCity implementálása - `main.js`

	```
	function addCity(city) {
		vm.cities.push(city);
		render();
	}
	```

4. __Teszt__


## 10. lépés, Emulator Teszt


1. Emulátor indítása
2. App telepítése az emulátorra
3. Exit API bekötése

	1. `app.js`:

	```
	case 10182:
        window.tizen.application.getCurrentApplication().exit();
        break;

    ...

    // Register tvKeys
	window.tizen.tvinputdevice.registerKey("Return");
	window.tizen.tvinputdevice.registerKey("Exit");
	```

    2. `main.js`:
    ```
	returnAction: function () {
    	window.tizen.application.getCurrentApplication().exit();
    },
    ```
4. __Teszt__