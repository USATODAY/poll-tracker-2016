define([
   "jquery",
], function(jQuery) {
    //set project data URL here
    var dataURL = "http://www.gannett-cdn.com/experiments/usatoday/2015/10/poll-tracker-2016/data/pt_main.json";
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
                "active": true,
                "full_name": "Donald Trump",
                "last_name": "Trump"
            },
            {
                "active": true,
                "full_name": "Ben Carson",
                "last_name": "Carson"
            },
            {
                "active": true,
                "full_name": "Marco Rubio",
                "last_name": "Rubio"
            },
            {
                "active": true,
                "full_name": "Jeb Bush",
                "last_name": "Bush"
            },
            {
                "active": true,
                "full_name": "Ted Cruz",
                "last_name": "Cruz"
            },
            {
                "active": true,
                "full_name": "Carly Fiorina",
                "last_name": "Fiorina"
            },
            {
                "active": true,
                "full_name": "Mike Huckabee",
                "last_name": "Huckabee"
            },
            {
                "active": true,
                "full_name": "Rand Paul",
                "last_name": "Paul"
            },
            {
                "active": true,
                "full_name": "John Kasich",
                "last_name": "Kasich"
            },
            {
                "active": true,
                "full_name": "Chris Christie",
                "last_name": "Christie"
            },
            {
                "active": true,
                "full_name": "Lindsey Graham",
                "last_name": "Graham"
            },
            {
                "active": true,
                "full_name": "Rick Santorum",
                "last_name": "Santorum"
            },
            {
                "active": true,
                "full_name": "Bobby Jindal",
                "last_name": "Jindal"
            },
            {
                "active": true,
                "full_name": "George Pataki",
                "last_name": "Pataki"
            },
            {
                "active": false,
                "full_name": "Scott Walker",
                "last_name": "Walker"
            },
            {
                "active": false,
                "full_name": "Rick Perry",
                "last_name": "Perry"
            }
        ],
        "democrat": [
            {
                "active": true,
                "full_name": "Hillary Clinton",
                "last_name": "Clinton"
            },
            {
                "active": true,
                "full_name": "Bernie Sanders",
                "last_name": "Sanders"
            },
            {
                "active": false,
                "full_name": "Jim Webb",
                "last_name": "Webb"
            },
            {
                "active": true,
                "full_name": "Martin O'Malley",
                "last_name": "O'Malley"
            },
            {
                "active": false,
                "full_name": "Lincoln Chafee",
                "last_name": "Chafee"
            }
        ]
    };

    STATES = {
      "10": {
        "stateAbbr": "DE",
        "name": "Delaware"
      },
      "11": {
        "stateAbbr": "DC",
        "name": "District of Columbia"
      },
      "12": {
        "stateAbbr": "FL",
        "name": "Florida"
      },
      "13": {
        "stateAbbr": "GA",
        "name": "Georgia"
      },
      "15": {
        "stateAbbr": "HI",
        "name": "Hawaii"
      },
      "16": {
        "stateAbbr": "ID",
        "name": "Idaho"
      },
      "17": {
        "stateAbbr": "IL",
        "name": "Illinois"
      },
      "18": {
        "stateAbbr": "IN",
        "name": "Indiana"
      },
      "19": {
        "stateAbbr": "IA",
        "name": "Iowa"
      },
      "20": {
        "stateAbbr": "KS",
        "name": "Kansas"
      },
      "21": {
        "stateAbbr": "KY",
        "name": "Kentucky"
      },
      "22": {
        "stateAbbr": "LA",
        "name": "Louisiana"
      },
      "23": {
        "stateAbbr": "ME",
        "name": "Maine"
      },
      "24": {
        "stateAbbr": "MD",
        "name": "Maryland"
      },
      "25": {
        "stateAbbr": "MA",
        "name": "Massachusetts"
      },
      "26": {
        "stateAbbr": "MI",
        "name": "Michigan"
      },
      "27": {
        "stateAbbr": "MN",
        "name": "Minnesota"
      },
      "28": {
        "stateAbbr": "MS",
        "name": "Mississippi"
      },
      "29": {
        "stateAbbr": "MO",
        "name": "Missouri"
      },
      "30": {
        "stateAbbr": "MT",
        "name": "Montana"
      },
      "31": {
        "stateAbbr": "NE",
        "name": "Nebraska"
      },
      "32": {
        "stateAbbr": "NV",
        "name": "Nevada"
      },
      "33": {
        "stateAbbr": "NH",
        "name": "New Hampshire"
      },
      "34": {
        "stateAbbr": "NJ",
        "name": "New Jersey"
      },
      "35": {
        "stateAbbr": "NM",
        "name": "New Mexico"
      },
      "36": {
        "stateAbbr": "NY",
        "name": "New York"
      },
      "37": {
        "stateAbbr": "NC",
        "name": "North Carolina"
      },
      "38": {
        "stateAbbr": "ND",
        "name": "North Dakota"
      },
      "39": {
        "stateAbbr": "OH",
        "name": "Ohio"
      },
      "40": {
        "stateAbbr": "OK",
        "name": "Oklahoma"
      },
      "41": {
        "stateAbbr": "OR",
        "name": "Oregon"
      },
      "42": {
        "stateAbbr": "PA",
        "name": "Pennsylvania"
      },
      "44": {
        "stateAbbr": "RI",
        "name": "Rhode Island"
      },
      "45": {
        "stateAbbr": "SC",
        "name": "South Carolina"
      },
      "46": {
        "stateAbbr": "SD",
        "name": "South Dakota"
      },
      "47": {
        "stateAbbr": "TN",
        "name": "Tennessee"
      },
      "48": {
        "stateAbbr": "TX",
        "name": "Texas"
      },
      "49": {
        "stateAbbr": "UT",
        "name": "Utah"
      },
      "50": {
        "stateAbbr": "VT",
        "name": "Vermont"
      },
      "51": {
        "stateAbbr": "VA",
        "name": "Virginia"
      },
      "53": {
        "stateAbbr": "WA",
        "name": "Washington"
      },
      "54": {
        "stateAbbr": "WV",
        "name": "West Virginia"
      },
      "55": {
        "stateAbbr": "WI",
        "name": "Wisconsin"
      },
      "56": {
        "stateAbbr": "WY",
        "name": "Wyoming"
      },
      "60": {
        "stateAbbr": "AS",
        "name": "American Samoa"
      },
      "66": {
        "stateAbbr": "GU",
        "name": "Guam"
      },
      "69": {
        "stateAbbr": "MP",
        "name": "Northern Mariana Islands"
      },
      "72": {
        "stateAbbr": "PR",
        "name": "Puerto Rico"
      },
      "74": {
        "stateAbbr": "UM",
        "name": "U.S. Minor Outlying Islands"
      },
      "78": {
        "stateAbbr": "VI",
        "name": "U.S. Virgin Islands"
      },
      "01": {
        "stateAbbr": "AL",
        "name": "Alabama"
      },
      "02": {
        "stateAbbr": "AK",
        "name": "Alaska"
      },
      "04": {
        "stateAbbr": "AZ",
        "name": "Arizona"
      },
      "05": {
        "stateAbbr": "AR",
        "name": "Arkansas"
      },
      "06": {
        "stateAbbr": "CA",
        "name": "California"
      },
      "08": {
        "stateAbbr": "CO",
        "name": "Colorado"
      },
      "09": {
        "stateAbbr": "CT",
        "name": "Connecticut"
      },
      "national": {
        "stateAbbr": "US",
        "name": "National"
      }
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
        CANDIDATES: CANDIDATES,
        STATES: STATES
    };
});
