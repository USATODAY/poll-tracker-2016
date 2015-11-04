define([
    "jquery",
    "underscore",
    "backbone",
    "api/analytics",
    "templates"
],
    function(jQuery, _, Backbone, Analytics, templates) {
        return Backbone.View.extend({
            el: '.iapp-share-wrap',
            template: templates['share.html'],
            events: {
                'click .iapp-share-close': 'onClickClose',
                'click .iapp-share-popup': 'onShareButtonClick'
            },
            initialize: function() {
                this.render();
                this.listenTo(this.model, 'change', this.render);
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            onClickClose: function() {

            },
            onShareButtonClick: function(e) {
                e.preventDefault();
                Analytics.trackEvent('Share button clicked: ' + jQuery(e.currentTarget).attr('id'));

              this.windowPopup(e.currentTarget.href, 500, 300);
            },
            windowPopup: function(url, width, height) {
                // Calculate the position of the popup so
                // it’s centered on the screen.
                var left = (screen.width / 2) - (width / 2),
                top = (screen.height / 2) - (height / 2);

                window.open(
                    url,
                    "",
                    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
                );
            }

        });
});
