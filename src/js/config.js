define([
   "jquery",
], function(jQuery) {
    //set project data URL here
    var dataURL = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/data/main_menu.json";
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
    var CANDIDATES = {
        "republican": [
            {
                "full_name": "Donald Trump",
                "last_name": "Trump"
            },
            {
                "full_name": "Ben Carson",
                "last_name": "Carson"
            },
            {
                "full_name": "Marco Rubio",
                "last_name": "Rubio"
            },
            {
                "full_name": "Jeb Bush",
                "last_name": "Bush"
            },
            {
                "full_name": "Ted Cruz",
                "last_name": "Cruz"
            },
            {
                "full_name": "Carly Fiorina",
                "last_name": "Fiorina"
            },
            {
                "full_name": "Mike Huckabee",
                "last_name": "Huckabee"
            },
            {
                "full_name": "Rand Paul",
                "last_name": "Paul"
            },
            {
                "full_name": "John Kasich",
                "last_name": "Kasich"
            },
            {
                "full_name": "Chris Christie",
                "last_name": "Christie"
            },
            {
                "full_name": "Lindsey Graham",
                "last_name": "Graham"
            },
            {
                "full_name": "Rick Santorum",
                "last_name": "Santorum"
            },
            {
                "full_name": "Bobby Jindal",
                "last_name": "Jindal"
            },
            {
                "full_name": "George Pataki",
                "last_name": "Pataki"
            },
            {
                "full_name": "Scott Walker",
                "last_name": "Walker"
            },
            {
                "full_name": "Rick Perry",
                "last_name": "Perry"
            }
        ],
        "democrat": [
            {
                "full_name": "Hillary Clinton",
                "last_name": "Clinton"
            },
            {
                "full_name": "Bernie Sanders",
                "last_name": "Sanders"
            },
            {
                "full_name": "Jim Webb",
                "last_name": "Webb"
            },
            {
                "full_name": "Martin O'Malley",
                "last_name": "O'Malley"
            },
            {
                "full_name": "Lincoln Chafee",
                "last_name": "Chafee"
            }
        ]
    };
    

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
        colors: colors,
        CANDIDATES: CANDIDATES
    };
});
