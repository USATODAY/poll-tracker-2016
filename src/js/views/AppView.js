define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils",
    "config",
    "collections/CandidateCollection",
    "views/ControlsView",
    "views/DetailView",
    "views/FeverNavView"
], function(jQuery, _, Backbone, templates, utils, config, CandidateCollection, ControlsView, DetailView, FeverNavView) {
    return Backbone.View.extend({
        initialize: function() {
            this.updateDetails = _.throttle(this.updateDetails, 1000);
            this.getData(config.dataURL);
            this.currentState = "US";
            this.listenTo(Backbone, "poll:setCurrent", this.updateDetails);
            this.listenTo(Backbone, "state:setCurrent", this.onStateChange);
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        render: function() {
            var _this = this;
            // this.setCollection(new CandidateCollection(this.data.rcp_avg[0].candidate));
            this.$('.iapp-loader-wrap').hide();
            this.$el.html(this.template());
            this.controlsView = new ControlsView({data: this.menuData.races[this.party]});
            this.detailView = new DetailView({data: this.data.rcp_avg[0], party: this.party});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg, party: this.party});
            return this;
        },
        getData: function(dataURL) {
            var _this = this;
            dataURL = utils.getDataURL(dataURL);
            jQuery.getJSON(dataURL, function(data) {
                _this.menuData = data;
                _this.setParty('republican');
            });
        },
        updateDetails: function(newIndex) {
            var _this = this;
            var maxVal = _this.data.rcp_avg.length - 1;
            if (newIndex > maxVal) {
                newIndex = maxVal;
            }
            _this.detailView.update(_this.data.rcp_avg[newIndex]);
        },
        setCollection: function(newCollection) {
            this.currentCollection = newCollection;
            this.currentCollection.setColors();
        },
        setParty: function(party) {
            //takes party name, save to view and adds color values to each candidate
            var _this = this;
            this.party = party;
            _.each(config.CANDIDATES[party], function(candidate, i) {
                candidate.color = config.colors[i];
            });
            console.log(this.menuData.races[this.party][0].url);
            //change this to dynamic URL later
            var raceDataURL = utils.getDataURL("http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/data/sample.json");
            jQuery.getJSON(raceDataURL, function(data) {
                _this.data = data;
                _this.render();
            });
        },
        onStateChange: function(stateName) {
            console.log("states set to: " + stateName);
        }
    });
});
