define(
  [
    'jquery',
    'underscore',
    'backbone',
    'draggabilly',
    'views/AppView'
  ],
  function(jQuery, _, Backbone, Draggabilly, AppView){
    var app = app || {};

    app.init = function() {
        require(['jquery-bridget/jquery.bridget'], function() {
            $.bridget( 'draggabilly', Draggabilly );
            addGlobalListeners();
            window.FIRST_CLICK = false;
            $('body').addClass('iapp-embed iapp-module');
            var appView = new AppView();
        });
    };

    function addGlobalListeners() {
        jQuery(window).on('resize', function(e) {
            Backbone.trigger("window:resize", e);
        });
        jQuery(window).on('scroll', function(e) {
            Backbone.trigger("window:scroll", e);
        });
    }

    return app;

});
