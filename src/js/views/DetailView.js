define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "templates",
    "config",
    "views/CandidateDetailView"
], function(jQuery, _, Backbone, d3, templates, config, CandidateDetailView) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.listenTo(Backbone, "window:resize", this.drawTicks);
            this.currentParty = opts.party;
            this.data = opts.data;
            this.candidates = config.CANDIDATES[this.currentParty];
            this.max_percent = 100;
            this.render();
        },
        el: '.iapp-detail-wrap',
        template: templates["DetailView.html"],
        candidateDetailViews: [],
        render: function() {
            var _this = this;
            this.$el.html(this.template());

            //create new array of candidates, joining our predifined candidates from config, with the current data
            var candidateData = this.joinCandidateData();

            // loop through each candidate entry in the views data
            _.each(candidateData, function(candidate, i) {
                //create new candidate detail view for each candidate in this data entry
                var candidateDetailView = new CandidateDetailView({data: candidate, max_percent:_this.max_percent});
                _this.$('.iapp-detail-inner').append(candidateDetailView.el);
                //save candidate detail view to detail view's array
                _this.candidateDetailViews.push(candidateDetailView);
            });
            this.drawTicks();
            return this;
        },
        drawTicks: function() {
            this.$('.iapp-detail-ticks-chart').remove();
            var margins = {
                top: 15,
                right: 50,
                bottom: 15,
                left: 50
            };
            var chartWidth = this.$el.outerWidth();
            var chartHeight = this.$el.outerHeight();


            var xScale = d3.scale.linear()
                .domain([0, this.max_percent])
                .range([margins.left, chartWidth - margins.right]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("top")
                .tickSize((chartHeight - (margins.top + margins.bottom)), 0, 0)
                .tickPadding(5)
                .tickFormat(function(d) {return d + "%";})
                .ticks((this.max_percent/20) + 1);

            var chartElement = d3.select(this.el).append('svg')
                .attr("height", chartHeight)
                .attr("width", chartWidth)
                .attr("class", "iapp-detail-ticks-chart");

            chartElement.append("g")
                .attr("class", "detail-grid")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis);
        },
        update: function(newData) {
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
        },
        joinCandidateData: function() {
            var _this = this;
            return _.sortBy(_.map(this.candidates, function(candidateObj) {
                return _this.lookupCandidate(candidateObj);
            }), function(candidateObj) {
                var val;
                if (candidateObj.value === "" || candidateObj.value === null) {
                    val = -1;
                } else {
                    val = parseFloat(candidateObj.value);
                }
                return val;
            }).reverse();
        },
        lookupCandidate: function(candidateObj) {
            var candidateData = _.findWhere(this.data.candidate, {name: candidateObj.last_name});
            if (candidateData) {
                return _.extend(candidateData, candidateObj);
            } else {
                return _.extend(candidateObj, {value: null, name: candidateObj.last_name});
            }
        }
    });
});
