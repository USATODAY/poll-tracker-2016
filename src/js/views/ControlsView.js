define([
    "jquery",
    "underscore",
    "backbone",
    "templates"
], function(jQuery, _, Backbone, templates) {
    return Backbone.View.extend({
        initialize: function(opts) {
            console.log(opts.data);
            this.render();
        },
        el: '.iapp-control-wrap',
        template: templates["ControlsView.html"],
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});
