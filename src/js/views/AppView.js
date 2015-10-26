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
            this.listenTo(Backbone, "poll:setCurrent", this.updateDetails);
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        render: function() {
            var _this = this;
            this.setCollection(new CandidateCollection(this.data.rcp_avg[0].candidate));
            this.$('.iapp-loader-wrap').hide();
            this.$el.append(this.template());
            this.controlsView = new ControlsView();
            this.detailView = new DetailView({data: this.data.rcp_avg[0], collection: this.currentCollection});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg});
            return this;
        },
        getData: function(dataURL) {
            var _this = this;
            dataURL = utils.getDataURL(dataURL);
            jQuery.getJSON(dataURL, function(data) {
                _this.data = data;
                _this.render();
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
        }
    });
});
