define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils",
    "config/main",
    "api/analytics",
    "collections/CandidateCollection",
    "models/ShareModel",
    "views/ControlsView",
    "views/DetailView",
    "views/FeverNavView",
    "views/ShareView",
    "views/InfoView"
], function(jQuery, _, Backbone, templates, utils, config, Analytics, CandidateCollection, ShareModel, ControlsView, DetailView, FeverNavView, ShareView, InfoView) {
    return Backbone.View.extend({
        initialize: function() {
            this.updateDetails = _.throttle(this.updateDetails, 1000);
            this.firstDrag = false;
            this.hideFeverNav = true;
            this.getData(config.dataURL);
            this.listenTo(Backbone, "poll:setCurrent", this.updateDetails);
            this.listenTo(Backbone, "state:setCurrent", this.onStateChange);
            this.listenTo(Backbone, "party:setCurrent", this.setParty);
            this.listenTo(Backbone, "fever:dragged", this.onDrag);
            this.listenTo(Backbone, "window:scroll", this.onScroll);
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
        events: {
            "click .iapp-info-button": "openInfo"
        },
        render: function() {
            var _this = this;

            //check to see if subview exist and remove them
            if (this.controlsView) {
                this.controlsView.remove();
            }
            if (this.detailView) {
                this.detailView.remove();
            }
            if (this.feverNavView) {
                this.feverNavView.remove();
            } 
            if (this.infoView) {
                this.infoView.remove();
            } 

            this.$el.append(this.template());
            this.controlsView = new ControlsView({data: this.menuData.races[this.party], party: this.party});
            this.detailView = new DetailView({data: this.data.rcp_avg[0], party: this.party});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg, party: this.party, showArrows: !this.firstDrag, hide: this.hideFeverNav});
            this.infoView = new InfoView();
            this.$el.append(this.infoView.el);
            this.$('.iapp-loader-wrap').hide();
            return this;
        },
        renderNewState: function() {
            var _this = this;
            if (this.detailView) {
                this.detailView.stopListening();
            }
            if (this.feverNavView) {
                this.feverNavView.stopListening();
            }
            this.detailView = new DetailView({data: this.data.rcp_avg[0], party: this.party});
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg, party: this.party});
            this.$('.iapp-loader-wrap').hide();
            return this;
        },
        getData: function(dataURL) {
            var _this = this;
            dataURL = utils.getDataURL(dataURL);
            jQuery.getJSON(dataURL, function(data) {
                //filter through available races and only use the ones predifined in config file
                _this.menuData = {
                    races: {
                        "republican": _.filter(data.races.republican, function(d) {
                            return _.contains(config.ENABLED_RACES.republican, d.state);
                        }),
                        "democrat": _.filter(data.races.democrat, function(d) {
                            return _.contains(config.ENABLED_RACES.democrat, d.state);
                        }),
                    }
                };
                _this.setParty('republican');
            });
        },
        onDrag: function() {
            if(!this.firstDrag) {
                this.firstDrag = true;
            }
        },
        updateDetails: function(newIndex) {
            var _this = this;
            var maxVal = _this.data.rcp_avg.length - 1;
            if (newIndex > maxVal) {
                newIndex = maxVal;
            }
            _this.detailView.update(_this.data.rcp_avg[newIndex]);
        },
        setParty: function(party) {
            /*
             * takes party name, save to view and adds color values to each candidate
             */
            this.$('.iapp-loader-wrap').show();
            var _this = this;
            //save party variable to view
            this.party = party;

            //set state to national
            this.currentState = "US";

            // make sure parties candidates have color values assigned
            _.each(config.CANDIDATES[party], function(candidate, i) {
                candidate.color = config.colors[i];
            });
            //store menu entry for current party and state
            var menuEntry = _.findWhere(this.menuData.races[party], {"state": this.currentState});
            //store url from menu data
            var raceDataURL = utils.getDataURL(menuEntry.url);
            

            //get data for current party and state
            jQuery.getJSON(raceDataURL, function(data) {
                _this.data = data;
                _this.render();
            });
        },
        onStateChange: function(stateName) {
            this.setState(stateName);
        },
        setState: function(state) {
            var _this = this;
            this.currentState = state;
            this.$('.iapp-loader-wrap').show();
            
            //store menu entry for current party and state
            var menuEntry = _.findWhere(this.menuData.races[this.party], {"state": this.currentState});
            //store url from menu data
            var raceDataURL = utils.getDataURL(menuEntry.url);
            //get data for current party and state
            jQuery.getJSON(raceDataURL, function(data) {
                _this.data = data;
                // _this.render();
                _this.renderNewState();
            });

        },
        openInfo: function() {
            if (!window.FIRST_CLICK) {
                Analytics.trackEvent("poll-tracker-first-click");
            }
            Analytics.trackEvent("poll-tracker-info-opened");
            Backbone.trigger("info:show");
        },
        onScroll: function() {
            if (this.hideFeverNav) {
                this.hideFeverNav = false;
            }
        }
    });
});
