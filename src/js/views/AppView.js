define([
    "jquery",
    "underscore",
    "backbone",
    "templates",
    "projUtils",
    "config",
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
            this.getData(config.dataURL);
            this.listenTo(Backbone, "poll:setCurrent", this.updateDetails);
            this.listenTo(Backbone, "state:setCurrent", this.onStateChange);
            this.listenTo(Backbone, "party:setCurrent", this.setParty);
        },
        el: '.iapp-app-wrap',
        template: templates["AppView.html"],
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
            this.feverNavView = new FeverNavView({data: this.data.rcp_avg, party: this.party});
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
                _this.menuData = data;
                _this.setParty('republican');
            });
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

        }
    });
});
