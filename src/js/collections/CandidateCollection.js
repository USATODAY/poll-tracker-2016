define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'models/CandidateModel'
], function(jQuery, _, Backbone, config, CandidateModel) {
    return Backbone.Collection.extend({
        initialize: function() {
        },
        model: CandidateModel,
        setColors: function() {
            this.each(function(candidateModel, index) {
                candidateModel.set({"color": config.colors[index]});
                console.log(candidateModel);
                console.log(config.colors[index]);
            });

        },
    });
});
