define(
  [
    'jquery',
    'underscore',
    'backbone',
    'models/config'
  ],
  function(jQuery, _, Backbone, config){

    return Backbone.Model.extend( {
        defaults: {
            'default_share_language': '',
            'stillimage': 'http://www.gannett-cdn.com/experiments/usatoday/2015/03/sunday-shows/img/fb-post.jpg'            
        },

        initialize: function() {
            var baseURL = window.location.origin + window.location.pathname;
           this.set({
                'baseURL': baseURL,
                'fbShare': this.createFbShareURL(baseURL),
                'twitterShare': this.createTwitterShareURL(baseURL),
                'encodedShare': encodeURIComponent(this.get('default_share_language')),
                'fb_id': config.facebook.app_id,
                'fb_redirect': 'http://' + window.location.hostname + '/pages/interactives/fb-share/',
                'email_link': this.createEmailLink(baseURL)
                
            }); 
           
        },

        createFbShareURL: function(url) {   
            url = url.replace('#', '%23');
            return encodeURI(url); 
        },

        createTwitterShareURL: function(url) {

            return encodeURIComponent(url); 
        },

        createEmailLink: function(url) {
            return "mailto:?body=" + encodeURIComponent(this.get('sharelanguage')) +  "%0d%0d" + this.createTwitterShareURL(url) + "&subject=";
        },

        updateLanguage: function(newShareStr) {
            this.set({
                'sharelanguage': newShareStr,
                'encodedShare': encodeURIComponent(newShareStr)
            });


        },

        updateUrls: function() {
            var shareUrl;
            var baseURL = this.get('baseURL');
            if (this.get('dislikePath') !== '' && this.get('likePath') !== '') {

                this.updateLanguage(this.bothText({dislikedNum: this.dislikedNum, likedNum: this.likedNum}));
                shareUrl = baseURL + '#likes/' + this.get('likePath') + '/dislikes/' + this.get('dislikePath');

            } else if (this.get('dislikePath') !== '') {

                this.updateLanguage(this.onlyDislikedText({dislikedNum: this.dislikedNum}));
                shareUrl = baseURL + '#dislikes/' + this.get('dislikePath');

            } else if (this.get('likePath') !== '') {

                this.updateLanguage(this.onlyLikedText({likedNum: this.likedNum}));
                shareUrl = baseURL + '#likes/' + this.get('likePath');

            } else {
                this.updateLanguage(this.get('default_share_language'));
                shareUrl = baseURL;

            }

            this.set({
                'fbShare': this.createFbShareURL(shareUrl),
                'twitterShare': this.createTwitterShareURL(shareUrl),
                'email_link': this.createEmailLink(shareUrl)
            });

        }
    });

});
