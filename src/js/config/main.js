define([
   "jquery",
   "config/races",
   "config/candidates",
   "config/states"

], function(jQuery, ENABLED_RACES, CANDIDATES, STATES) {
    //set project data URL here
    var dataURL = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/data/pt_main.json";
    //set project image path here
    var imagePath = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/img/";

    //set project default share language here
    var defaultShareLanguage = "Follow who's up and who's down in the 2016 presidential race with USA TODAY's Poll Tracker";
    var defaultTwitterShare = "Follow who's up and who's down in the 2016 presidential race with @USATODAY's Poll Tracker";
    var defaultShareImage = null;

    var projectTitle = "USA TODAY’s 2016 Presidential Poll Tracker";

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

    var credits = "Lee Horwich, Cooper Allen, Katie Smith, Mitchell Thorson, Shawn Sullivan and Chad Palmer, USA TODAY";
    var aboutText = "Poll Tracker is powered by data from RealClearPolitics, which tracks and averages polling results at the state and national level.";

    fb_app_id = staticInfo.facebook.app_id; 

    return {
        image_path: imagePath,
        dataURL: dataURL,
        staticInfo: staticInfo,
        fb_app_id: fb_app_id,
        isMobile: isMobile,
        // isTablet: isTablet,
        defaultShareLanguage: defaultShareLanguage,
        defaultTwitterLanguage: defaultTwitterShare,
        defaultShareImage: defaultShareImage,
        isIframe: blnIframeEmbed,
        colors: colors,
        CANDIDATES: CANDIDATES,
        STATES: STATES,
        credits: credits,
        aboutText: aboutText,
        projectTitle: projectTitle,
        ENABLED_RACES: ENABLED_RACES
    };
});
