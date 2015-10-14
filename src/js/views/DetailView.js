define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "views/CandidateDetailView"
], function(jQuery, _, Backbone, templates, CandidateDetailView) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = opts.data;
            this.render();
        },
        el: '.iapp-detail-wrap',
        template: templates["DetailView.html"],
        candidateDetailViews: [],
        render: function() {
            var _this = this;
            this.$el.html(this.template());
            // loop through each candidate entry in the views data
            _.each(this.data.candidate, function(candidateData) {
                //create new candidate detail view for each candidate in this data entry
                var candidateDetailView = new CandidateDetailView({data: candidateData});
                _this.$el.append(candidateDetailView.el);
                //save candidate detail view to detail view's array
                _this.candidateDetailViews.push(candidateDetailView);
            });
            return this;
        },
        update: function(newData) {
            var _this = this;
            this.data = newData;
            _.each(this.candidateDetailViews, function(candidateDetailView) {
                var name = candidateDetailView.data.name;
                var newDetailData = _.findWhere(_this.data.candidate, {name: name});
                candidateDetailView.update(newDetailData);
            });
        }
    });
});
