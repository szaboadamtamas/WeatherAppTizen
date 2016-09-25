function City(name, data) {
  this.name = name || '';
  this.data = data || {};
}
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