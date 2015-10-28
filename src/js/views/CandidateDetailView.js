define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "config",
    "velocity"
], function(jQuery, _, Backbone, templates, config, Velocity) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = opts.data;
            this.max_percent = opts.max_percent;
            this.render();
        },
        className: "iapp-candidate-detail-wrap",
        template: templates["candidateDetailView.html"],
        render: function() {
            this.$el.html(this.template({candidate: this.data, photo: this.getPhoto()}));
            var offsetX;
            if (this.data.value) {
                var adjustedPercent = this.getAdjustedPercent(this.data.value);
                offsetX = "-" + (100 - adjustedPercent) + "%";
                this.$el.velocity({
                    translateX: [offsetX, "-100%"],
                    duration: 2000,
                    easing: "easeOutExpo"
                });
            } else {
                offsetX = "-100%";
                this.$el.addClass('iapp-candidate-inactive');
                this.$('.iapp-candidate-percent').text("");

            }
            return this;
        },
        update: function(newData) {
            this.data = newData;
            var offsetX;
            if (this.data.value) {
                this.$el.removeClass('iapp-candidate-inactive');
                offsetX = "-" + (100 - this.data.value) + "%";
                this.$('.iapp-candidate-percent').text(this.data.value + "%");
            } else {
                offsetX = "-100%";
                this.$el.addClass('iapp-candidate-inactive');
                this.$('.iapp-candidate-percent').text("");
            }

            this.$el.velocity({
                translateX: offsetX,
                duration: 1000,
                easing: "easeOutExpo"
            });
        },
        getAdjustedPercent: function(value) {
            return (value / this.max_percent) * 100;
        },
        getPhoto: function() {
            var cleanName = this.data.name.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
            return config.image_path + "candidates/" + cleanName + ".jpg";
        }

    });
});
