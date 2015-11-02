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
            this.party = opts.party;
            this.render();
        },
        el: '.iapp-control-wrap',
        template: templates["ControlsView.html"],
        events: {
            "change #race-select": "onRaceSelectChange",
            "change input[type=radio][name=party]": "onPartyChange"
        },
        render: function() {
            this.$el.html(this.template({states: this.data, getFullState: utils.getFullStateName}));
            this.$('input[type=radio][value='+ this.party + ']').prop('checked', true);
            return this;
        },
        onRaceSelectChange: function(e) {
            var state = e.target.value;
            this.$('.iapp-race-select-display-location').text(utils.getFullStateName(state));
            Backbone.trigger("state:setCurrent", state);
        },
        onPartyChange: function(e) {
            var newParty = e.target.value;
            console.log(newParty);
            Backbone.trigger("party:setCurrent", newParty);
            // Backbone.trigger("party:setCurrent", newParty);
            console.log("test");
        }
    });
});
