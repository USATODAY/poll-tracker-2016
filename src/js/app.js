define(
  [
    'jquery',
    'underscore',
    'templates',
    'views/AppView'
  ],
  function(jQuery, _, templates, AppView){
    var app = app || {};

    app.init = function() {
        var appView = new AppView();
        // appView.render();
    };

    return app;

});
