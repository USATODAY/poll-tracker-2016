define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils"
], function(jQuery, _, Backbone, templates, utils) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = opts.data;
            this.render();
        },
        el: '.iapp-control-wrap',
        template: templates["ControlsView.html"],
        events: {
            "change #race-select": "onRaceSelectChange"
        },
        render: function() {
            this.$el.html(this.template({states: this.data, getFullState: utils.getFullStateName}));
            return this;
        },
        onRaceSelectChange: function(e) {
            var state = e.target.value;
            this.$('.iapp-race-select-display-location').text(state);
            Backbone.trigger("state:setCurrent", state);
        }
    });
});
