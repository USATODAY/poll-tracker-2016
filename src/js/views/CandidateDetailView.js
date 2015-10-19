define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "velocity"
], function(jQuery, _, Backbone, templates, Velocity) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = opts.data;
            this.render();
        },
        className: "iapp-candidate-detail-wrap",
        template: templates["candidateDetailView.html"],
        render: function() {
            this.$el.html(this.template({candidate: this.data}));
            var offsetX = "-" + (100 - this.data.value) + "%";
            this.$el.velocity({
                translateX: [offsetX, "-100%"],
                duration: 2000,
                easing: "easeOutExpo"
            });
            return this;
        },
        update: function(newData) {
            this.data = newData;
            var offsetX;
            if (this.data.value) {
                offsetX = "-" + (100 - this.data.value) + "%";
                this.$('.iapp-candidate-percent').text(this.data.value + "%");
            } else {
                offsetX = "-100%";
                this.$('.iapp-candidate-percent').text("0%");
            }

            this.$el.velocity({
                translateX: offsetX,
                duration: 2000,
                easing: "easeOutExpo"
            });
        },

    });
});
