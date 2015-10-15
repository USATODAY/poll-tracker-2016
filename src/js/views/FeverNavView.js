define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "templates"
], function(jQuery, _, Backbone, d3, templates) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.data = this.parseData(opts.data);
            var colors = {};
            _.each(opts.data[0].candidate, function(candidate) {
                colors[candidate.name] = candidate.color;
            });
            this.colors = colors;
            console.log(this.colors);
            this.render();
        },
        template: templates["feverNavView.html"],
        el: ".iapp-fever-nav-wrap",
        render: function() {
            this.$el.html(this.template());
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
                    .ticks(d3.time.weeks);
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
            });

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
            return {
                height: 180,
                width: width
            };
        },
        getMargin: function() {
            return {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            };
        }
    });
});
