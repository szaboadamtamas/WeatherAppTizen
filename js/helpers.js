/// HandleBar helpers ...
Handlebars.registerHelper('celsius', function (kelvin) {
  return (parseFloat(kelvin) - 273.15).toFixed(2);
});
Handlebars.registerHelper('time', function (timestamp) {
  var date = new Date(timestamp * 1000);
  return date.getHours() + ':' + ('0'+date.getMinutes()).slice(-2);
});
