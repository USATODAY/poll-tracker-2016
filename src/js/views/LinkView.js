define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "config/main"
], function(jQuery, _, Backbone, templates, config) {
    return Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        template: templates['LinkView.html'],
        
        className: "iapp-link-wrap iapp-info-show",
        
        events: {
            "click .iapp-info-background": "closeInfo",
            "click .iapp-info-close": "closeInfo",
            "click .iapp-link-close": "closeInfo"
        },

        render: function() {
            this.$el.html(this.template({linkURL: config.new_url, language: config.new_url_language}));
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
