define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "config"
], function(jQuery, _, Backbone, templates, config) {
    return Backbone.View.extend({
        initialize: function() {
            this.listenTo(Backbone, 'info:show', this.showInfo);
            this.render();
        },
        events: {
            "click .iapp-info-background": "closeInfo",
            "click .iapp-info-close": "closeInfo"
        },
        className: "iapp-info-wrap",
        template: templates["InfoView.html"],
        render: function() {
            this.$el.html(this.template({projectInfo: config.aboutText, credits: config.credits}));
            return this;
        },
        closeInfo: function() {
            this.$el.removeClass('iapp-info-show');
        },
        showInfo: function() {
            this.$el.addClass('iapp-info-show');
        }
    });
});
