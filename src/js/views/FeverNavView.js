define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "textures",
    "humanize",
    "templates",
    "jquery_ui",
    "jquery_ui_touch_punch"
], function(jQuery, _, Backbone, d3, textures, humanize, templates) {
    return Backbone.View.extend({
        initialize: function(opts) {
            this.listenTo(Backbone, "window:resize", this.redraw);
            console.log(opts.data);
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
            // this.containerWidth = this.$el.width() - 40;
            this.containerWidth = this.$(".iapp-fever-nav-chart-wrap").width();
            this.updateDate();
            this.$scrubber = this.$('.iapp-fever-nav-scrubber-wrap');
            this.$scrubber.draggable({
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

            var color = this.color = d3.scale.category10();

            var x = this.x = d3.time.scale()
                .range([0, dimensions.width]);

            var y = this.y = d3.scale.linear()
                .range([dimensions.height, 0]);

            var xAxis = this.xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = this.yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = this.line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

            // function for the x grid lines
            

            color.domain(d3.keys(data[data.length - 1]).filter(function(key) { return key !== "date"; }));
            var candidates = this.candidates = d3.keys(data[0]).filter(function(k) {return k !== "date"; }).map(function(candidate) {
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

            var svg = d3.select(this.$('.iapp-fever-nav-chart-inner-wrap')[0]).append("svg")
                .attr("width", dimensions.width + margin.left + margin.right)
                .attr("height", dimensions.height + margin.top + margin.bottom)
                .attr("class", 'iapp-fever-chart')
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // svg.append("rect")
            //     .attr("width", dimensions.width + margin.left + margin.right)
            //     .attr("height", dimensions.height + margin.top + margin.bottom)
            //     .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
            //     .attr("class", 'iapp-fever-chart-bg')
            //     .attr("fill", 'white')
            //     .attr("rx", 6)
            //     .attr("ry", 6);


                        
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + dimensions.height + ")")
                .call(this.make_x_axis()
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

            this.drawEndBuffers(dimensions, margin);
            
            this.$chart = this.$('.iapp-fever-nav-chart-inner-wrap');
            this.$chart.draggable({
                axis: "x",
                containment: this.getContainment(),
                drag: _.bind(_this.chartDrag, _this),
            });


        },
        make_x_axis: function() {
            return d3.svg.axis()
                .scale(this.x)
                .orient("bottom")
                .ticks(d3.time.weeks, 2);
        },
        redraw: function() {
            var _this = this;
            this.containerWidth = this.$(".iapp-fever-nav-chart-wrap").width();
            var dimensions = this.getDimensions(),
                margin = this.getMargin(),
                color = this.color,
                line = this.line,
                candidates = this.candidates;

            this.x.range([0, dimensions.width]);

            this.y.range([dimensions.height, 0]);

            this.$('.iapp-fever-nav-chart-inner-wrap').empty();
            var svg = d3.select(this.$('.iapp-fever-nav-chart-inner-wrap')[0]).append("svg")
                .attr("width", dimensions.width + margin.left + margin.right)
                .attr("height", dimensions.height + margin.top + margin.bottom)
                .attr("class", 'iapp-fever-chart')
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + dimensions.height + ")")
                .call(this.make_x_axis()
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
            
            this.drawEndBuffers(dimensions, margin);
        },
        drawEndBuffers: function(dimensions, margin) {
            var svg = d3.select(this.$('.iapp-fever-chart')[0]);

            var t = textures.lines()
                .thicker()
                .stroke("#E5E5E5");

            svg.call(t);

            svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", dimensions.height + margin.bottom + margin.top)
                .attr("width", margin.left)
                .attr("class", "iapp-fever-end-buffer")
                .attr("fill", t.url());

            svg.append("rect")
                .attr("x", dimensions.width + margin.right)
                .attr("y", 0)
                .attr("height", dimensions.height + margin.bottom + margin.top)
                .attr("width", margin.right)
                .attr("class", "iapp-fever-end-buffer")
                .attr("fill", t.url());

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
            var width = document.body.clientWidth >= 1200 ? (2320 - (margin.left + margin.right)) : ((document.body.clientWidth - 40) * 2  - (margin.left + margin.right));
            var height = 140 - (margin.top + margin.bottom);
            return {
                height: height,
                width: width
            };
        },
        getMargin: function() {
            return {
                top: 10,
                right: 50,
                bottom: 10,
                left: 50
            };
        },
        scrubDrag: function(e, ui) {
            //runs when scrubber is dragged
            this.$chart.stop();
            this.$scrubber.stop();
            var range = this.containerWidth - 100;
            var percPos = (ui.position.left - 20) / range;
            var percStr = (percPos * 100) + "%";
            var pixelStr = "" + (percPos * this.containerWidth);
            var newDataIndex = Math.floor((1 - percPos) * this.data.length);
            this.$chart.css({left: "-" + pixelStr + "px"});
            this.setEntry(newDataIndex);
        },
        chartDrag: function(e, ui) {
            //runs when chart is dragged
            this.$chart.stop();
            this.$scrubber.stop();
            var range = this.containerWidth;
            percPos = Math.abs(ui.position.left) / range;
            var newDataIndex = Math.floor((1 - percPos) * this.data.length);
            var newScrubberPos = (range - 100) * percPos + 20;
            this.$scrubber.css({left: newScrubberPos});
            this.setEntry(newDataIndex);
        },
        updateDate: function() {
            var currentDate = this.data[this.currentEntry].date;
            var dateText = humanize.date("M j, Y", currentDate);
            this.$(".iapp-fever-nav-scrubber-top").text(dateText);
        },
        setEntry: function(newIndex) {
            if (newIndex > this.data.length - 1) {
                newIndex = this.data.length - 1;
            } else if (newIndex < 0) {
                newIndex = 0;
            }
            this.currentEntry = newIndex;
            _.throttle(_.bind(this.updateDate, this), 1000)();
            Backbone.trigger("poll:setCurrent", this.currentEntry);
        },
        getContainment: function() {
            var winOffset = (document.body.clientWidth - this.containerWidth) / 2;
            var leftMin = -(this.containerWidth - winOffset);
            return [leftMin, 0, winOffset, 0];
        }
    });
});
