define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "humanize",
    "templates",
    "jquery_ui",
    "jquery_ui_touch_punch"
], function(jQuery, _, Backbone, d3, humanize, templates) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = this.parseData(opts.data);
            var colors = {};
            _.each(opts.data[0].candidate, function(candidate) {
                colors[candidate.name] = candidate.color;
            });
            this.colors = colors;
            this.currentEntry = 0;
            this.$chart = null;
            this.render();
        },
        template: templates["feverNavView.html"],
        el: ".iapp-fever-nav-wrap",
        render: function() {
            var _this = this;
            this.$el.html(this.template());

            //cache el's width for later use
            this.containerWidth = this.$el.width();

            var currentDate = this.data[this.currentEntry].date;
            var dateText = humanize.date("M j, Y", currentDate);
            this.$(".iapp-fever-nav-scrubber-top").text(dateText);
            this.$(".iapp-fever-nav-scrubber-wrap").draggable({
                axis: "x",
                containment: "parent",
                drag: _.bind(_this.scrubDrag, _this)
            });
            this.drawChart(this.data);
        },
        drawChart: function(data) {
            var _this = this;
            var dimensions = this.getDimensions();
            var margin = this.getMargin();

            var color = d3.scale.category10();

            var x = d3.time.scale()
                .range([0, dimensions.width]);

            var y = d3.scale.linear()
                .range([dimensions.height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

            // function for the x grid lines
            function make_x_axis() {
                return d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(d3.time.weeks, 2);
            }

            color.domain(d3.keys(data[data.length - 1]).filter(function(key) { return key !== "date"; }));
            var candidates = d3.keys(data[0]).filter(function(k) {return k !== "date"; }).map(function(candidate) {
                return {
                    name: candidate,
                    values: data.map(function(d) {
                        return {
                            date: d.date,
                            value: d[candidate] ? d[candidate] : 0
                        };
                    })
                };
            }).reverse();

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([
                d3.min(candidates, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                d3.max(candidates, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
            ]);

            var svg = d3.select(this.$('.iapp-fever-nav-chart-wrap')[0]).append("svg")
                .attr("width", dimensions.width + margin.left + margin.right)
                .attr("height", dimensions.height + margin.top + margin.bottom)
                .attr("class", 'iapp-fever-chart')
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.$chart = this.$('.iapp-fever-chart');
            
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + dimensions.height + ")")
                .call(make_x_axis()
                    .tickSize(-dimensions.height, 0, 0)
                    .tickFormat("")
                );


            var candidate = svg.selectAll(".candidate")
                .data(candidates)
                .enter().append("g")
                .attr("class", "candidate");

            
            candidate.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return _this.colors[d.name]; });

            
        
        },
        parseData: function(rawData) {
            //Take in raw poll data and format into a candidate-based format
            return rawData.map(function(dataEntry){
                newObj = {
                    date: new Date(dataEntry.date)
                };
                _.each(dataEntry.candidate, function(candidate) {
                    newObj[candidate.name] = candidate.value !== "" ? parseInt(candidate.value): 0;
                });
                return newObj;
            });
        },
        getDimensions: function() {
            margin = this.getMargin();
            var width = window.innerWidth >= 1200 ? (2400 - (margin.left + margin.right)) : (window.innerWidth * 2 - (margin.left + margin.right));
            var height = 180 - (margin.top + margin.bottom);
            return {
                height: height,
                width: width
            };
        },
        getMargin: function() {
            return {
                top: 30,
                right: 50,
                bottom: 10,
                left: 50
            };
        },
        scrubDrag: function(e, ui) {
            //runs when scrubber is dragged
            var range = this.containerWidth - 100;
            var percPos = ui.position.left / range;
            var percStr = (percPos * 100) + "%";
            var newDataIndex = Math.floor((1 - percPos) * this.data.length);
            this.$chart.css({left: "-" + percStr});
            this.setEntry(newDataIndex);
        },
        chartDrag: function(e, ui) {
            //runs when chart is dragged
        },
        setEntry: function(newIndex) {
            this.currentEntry = newIndex;
            Backbone.trigger("poll:setCurrent", this.currentEntry);
        }
    });
});
