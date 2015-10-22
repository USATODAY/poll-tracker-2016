define([
   "jquery",
], function(jQuery) {
    //set project data URL here
    var dataURL = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/data/sample.json";
    //set project image path here
    var imagePath = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/img/";

    //set project default share language here
    var defaultShareLanguage = null;
    var defaultShareImage = null;

    var isMobile, fb_app_id;
    var isTablet = false;

    var blnIframeEmbed = window != window.parent;

    var staticInfo = JSON.parse(jQuery(".staticinfo").html());
    
    var colors = ["#18a743", "#e62319", "#9d1aba", "#1fc0bf", "#fa6621", "#fcc92e", "#177c37", "#a52116", "#761787", "#1a8a8a", "#b34f1b", "#b49023", "#76ce94", "#f08276", "#c876d8", "#77dcdb", "#fba978", "#fce07b"];

    if (staticInfo.platform == "desktop") {
        isMobile = false;
    } else {
        isMobile = true;
    }

    fb_app_id = staticInfo.facebook.app_id;

    return {
        image_path: imagePath,
        dataURL: dataURL,
        staticInfo: staticInfo,
        fb_app_id: fb_app_id,
        isMobile: isMobile,
        // isTablet: isTablet,
        defaultShareLanguage: defaultShareLanguage,
        defaultShareImage: defaultShareImage,
        isIframe: blnIframeEmbed,
        colors: colors
    };
});
