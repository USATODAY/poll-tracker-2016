define([
    'jquery',
    'underscore',
    'config/main'
    ],
    function(jQuery, _, config) {
        return {
            getDataURL: function(dataURL) {
                var hostname = window.location.hostname;
                var dataURLSplit = dataURL.split('/');
                var filename = dataURLSplit[dataURLSplit.length - 1];
                if ((hostname == "localhost" || hostname == "10.0.2.2")) {
                    dataURL = 'data/' + filename;
                } else if (hostname == "www.gannett-cdn.com") {
                    dataURL = dataURL;
                } else {
                    dataURL = "http://" + hostname + "/services/webproxy/?url=" + dataURL;
                }
                return dataURL;
            },
            getFullStateName: function(stateAbbr) {
                var stateObj = _.findWhere(config.STATES, {'stateAbbr': stateAbbr});
                return stateObj.name;
            }
            
        };
});
