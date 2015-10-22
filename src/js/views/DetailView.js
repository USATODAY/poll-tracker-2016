define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "config",
    "views/CandidateDetailView"
], function(jQuery, _, Backbone, templates, config, CandidateDetailView) {
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
            _.each(this.data.candidate, function(candidateData, i) {
                //create new candidate detail view for each candidate in this data entry
                candidateData.color = config.colors[i];
                var candidateDetailView = new CandidateDetailView({data: candidateData});
                _this.$el.append(candidateDetailView.el);
                //save candidate detail view to detail view's array
                _this.candidateDetailViews.push(candidateDetailView);
            });
            return this;
        },
        update: function(newData) {
            console.log("update");
            var _this = this;
            this.data = newData;
            _.each(this.candidateDetailViews, function(candidateDetailView) {
                if (candidateDetailView) {
                    var name = candidateDetailView.data.name;
                    var newDetailData = _.findWhere(_this.data.candidate, {name: name});
                    //check if data exists for candidate in new entry
                    if (newDetailData) {
                        candidateDetailView.update(newDetailData);
                    } else {
                        candidateDetailView.update({name: name, value: null});
                    }
                }
                
            });
        }
    });
});
