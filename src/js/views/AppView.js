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
            this.getData();
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        render: function() {
            var _this = this;
            this.$el.append(this.template());
            this.controlsView = new ControlsView();
            this.detailView = new DetailView({data: this.data.rcp_avg[285]});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg});
            _.delay(function() {
                _this.detailView.update(_this.data.rcp_avg[0]);
            }, 3000);
            return this;
        },
        getData: function() {
            var _this = this;
            var dataURL = utils.getDataURL(config.dataURL);
            jQuery.getJSON(dataURL, function(data) {
                _this.data = data;
                _this.render();
            });
        }
    });
});
