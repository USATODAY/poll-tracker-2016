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
            this.hideFeverNav = false;
            this.params = this.parseQueryString(window.location.search);
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

            var isEmbed = Boolean(this.params.embed);
            var isModule = Boolean(this.params.module);


            // if (params.party) {
                // this.setParty(params.party);
            // }

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

            this.$el.append(this.template({isModule: isModule}));
            if (!isEmbed) {
                $('body').removeClass('iapp-embed');
                $('body').removeClass('iapp-module');
                this.detailView = new DetailView({data: this.data.rcp_avg[0], party: this.party});
                this.controlsView = new ControlsView({data: this.menuData.races[this.party], currentState: this.currentState, party: this.party});
                this.feverNavView = new FeverNavView({data: this.data.rcp_avg, party: this.party, showArrows: !this.firstDrag, hide: this.hideFeverNav});
                this.infoView = new InfoView();
                this.$el.append(this.infoView.el);
            } else if (isModule) {
                this.$el.prepend(templates['embedInfo.html']({'module': true, currentState: utils.getFullStateName(this.currentState)}));
                this.detailView = new DetailView({data: this.r_data.rcp_avg[0], party: 'republican', el: this.$('.iapp-detail-wrap')[0], embed: true});
                this.detailView = new DetailView({data: this.d_data.rcp_avg[0], party: 'democrat', el: this.$('.iapp-detail-wrap')[1], embed: true});
            } else {
                $('body').removeClass('iapp-module');
                this.$el.prepend(templates['embedInfo.html']({'module': false, currentParty: this.party, currentState: this.currentState}));
                this.detailView = new DetailView({data: this.data.rcp_avg[0], party: this.party, embed: true});
            }
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
            var initialParty = 'republican';
            if (this.params.party == 'democrat') {
                initialParty = 'democrat';
            }
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
                _this.setParty(initialParty);
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
            var isEmbed = Boolean(this.params.embed);
            var isModule = Boolean(this.params.module);
            this.$('.iapp-loader-wrap').show();
            var _this = this;
            //save party variable to view
            this.party = party;

            //check params for valid state
            var stateParam = this.params.state ? this.params.state.toUpperCase() : '';
            if (_.contains(config.ENABLED_RACES[party], stateParam)) {
                this.currentState = this.params.state;
            } else {
                //set state to national if no other specified
                this.currentState = "US";
            }
            if (!isModule) {

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
            } else {
                // make sure parties candidates have color values assigned
                _.each(config.CANDIDATES['republican'], function(candidate, i) {
                    candidate.color = config.colors[i];
                });
                _.each(config.CANDIDATES['democrat'], function(candidate, i) {
                    candidate.color = config.colors[i];
                });
                //store menu entry for current party and state
                var r_menuEntry = _.findWhere(this.menuData.races['republican'], {"state": this.currentState});
                var d_menuEntry = _.findWhere(this.menuData.races['democrat'], {"state": this.currentState});
                //store url from menu data
                var r_raceDataURL = utils.getDataURL(r_menuEntry.url);
                var d_raceDataURL = utils.getDataURL(d_menuEntry.url);
                
                //get data for current party and state
                jQuery.getJSON(r_raceDataURL, function(data) {
                    _this.r_data = data;
                    jQuery.getJSON(d_raceDataURL, function(data) {
                        _this.d_data = data;
                        _this.render();
                    });
                });
            } 
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
            utils.firstClick();
            Analytics.trackEvent("poll-tracker-info-opened");
            Backbone.trigger("info:show");
        },
        onScroll: function() {
            if (this.hideFeverNav) {
                this.hideFeverNav = false;
            }
        },
        parseQueryString: function(queryString) {
            var parsedObj = {};
            var query = queryString.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                var key = pair[0],
                    value = pair[1];
                parsedObj[key] = value;
            }
            return parsedObj;
        }
    });
});
