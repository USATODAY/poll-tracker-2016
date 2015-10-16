define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils",
    "config",
    "views/ControlsView",
    "views/DetailView",
    "views/FeverNavView"
], function(jQuery, _, Backbone, templates, utils, config, ControlsView, DetailView, FeverNavView) {
    return Backbone.View.extend({
        initialize: function() {
            this.updateDetails = _.throttle(this.updateDetails, 1000);
            this.getData();
            this.listenTo(Backbone, "poll:setCurrent", this.updateDetails);
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        render: function() {
            var _this = this;
            this.$el.append(this.template());
            this.controlsView = new ControlsView();
            this.detailView = new DetailView({data: this.data.rcp_avg[0]});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg});
            return this;
        },
        getData: function() {
            var _this = this;
            var dataURL = utils.getDataURL(config.dataURL);
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
        }
    });
});
