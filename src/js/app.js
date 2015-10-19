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
        addGlobalListeners();
        var appView = new AppView();
        // appView.render();
    };

    function addGlobalListeners() {
        jQuery(window).on('resize', function(e) {
            Backbone.trigger("window:resize");
        });
    }

    return app;

});
