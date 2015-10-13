define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "views/ControlsView"
], function(jQuery, _, Backbone, templates, ControlsView) {
    return Backbone.View.extend({
        initialize: function() {
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        render: function() {
            this.$el.append(this.template());
            this.controlsView = new ControlsView();
            return this;
        }
    });
});
