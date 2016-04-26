define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils",
    "views/ShareView",
    "models/ShareModel",
    "api/analytics"
], function(jQuery, _, Backbone, templates, utils, ShareView, ShareModel, Analytics) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = opts.data;
            this.party = opts.party;
            this.currentState = opts.currentState;
            this.render();
        },
        el: '.iapp-control-wrap',
        template: templates["ControlsView.html"],
        events: {
            "change #race-select": "onRaceSelectChange",
            "change input[type=radio][name=party]": "onPartyChange"
        },
        render: function() {
            this.$el.html(this.template({states: this.data, currentState: this.currentState, getFullState: utils.getFullStateName}));
            this.shareModel = new ShareModel();
            this.shareView = new ShareView({model: this.shareModel});
            this.$('input[type=radio][value='+ this.party + ']').prop('checked', true);
            return this;
        },
        onRaceSelectChange: function(e) {
            var state = e.target.value;
            this.$('.iapp-race-select-display-location').text(utils.getFullStateName(state));
            utils.firstClick();
            Analytics.trackEvent("poll-tracker-race-location-changed");
            Backbone.trigger("state:setCurrent", state);
        },
        onPartyChange: function(e) {
            var newParty = e.target.value;
            utils.firstClick();
            Analytics.trackEvent("poll-tracker-party-changed");
            Backbone.trigger("party:setCurrent", newParty);
        }
    });
});
