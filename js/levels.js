game.levels = [
    {
        "intro" : "We'll start off with something easy.",
        "outro" : "That was too easy, wasn't it?",
        "name" : "square",

        "code" : [
            "box.square = function square (x) {",
            "    //return x squared",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 3, "column" : 4 },

        "tests" : [
            { "param" :  2,   "result" : 4    },
            { "param" :  4,   "result" : 16   },
            { "param" :  1.5, "result" : 2.25 },
            { "param" : -12,  "result" : 144  },
            { "param" : -1.5, "result" : 2.25 }
        ]
    },
    {
        "intro" : "A bit trickier now...",
        "outro" : "This was actually a problem I had. My solution looked...cleaner...",
        "name" : "invertCase",

        "code" : [
            "box.invertCase = function invertCase (x) {",
            "    // x is a string. turn lowercase letters to uppercase and vice versa.",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 3, "column" : 4 },

        "tests" : [
            { "param" : "funkey monkey", "result" : "FUNKEY MONKEY" },
            { "param" : "MONKEY MAGIC",  "result" : "monkey magic" },
            { "param" : "FlIrPyDuck",    "result" : "fLiRpYdUCK" },
            { "param" : "", "result" : "" },
            // WELL I RAN OUT OF IDEAS K?
        ]
    },
    {
        "intro" : "Tricky tricky rice is sticky.",
        "outro" : "Great! Prepare yourself for the real challenge!",
        "name" : "sumDigits",

        "code" : [
            "box.sumDigits = function sumDigits (x) {",
            "    //sum the digits of the number x",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 3, "column" : 4 },

        "tests" : [
            { "param" : 2,     "result" : 2  },
            { "param" : 412,   "result" : 7  },
            { "param" : 8.19,  "result" : 18 },
            { "param" : 4.12,  "result" : 7  },
            { "param" : 0,     "result" : 0  },
            { "param" : -14,   "result" : 5  },
            { "param" : -1.4,  "result" : 5  }
        ]
    },
    {
        "intro" : "This is harder than the original, yes.",
        "outro" : "Good work, but we're not done yet!",
        "name" : "flatten",

        "code" : [
            "box.flatten = function flatten (x) {",
            "    // x is an arbitrarily nested, multidimensional array.",
            "    // return x flattened (all items in 1 dimension)",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 4, "column" : 4 },

        "tests" : [
            { "param" : [], "result" : [] },
            { "param" : [0, 1, 2], "result" : [0, 1, 2] },
            { "param" : [[], 0, [1]], "result" : [0, 1] },
            {
                "param"  : [0, [[[[[1, [2]]]]], 3], [4, [5]]],
                "result" : [0, 1, 2, 3, 4, 5]
            }
        ]
    },
    {
        "intro" : "We haven't had a string question yet!",
        "outro" : "A freshmen comp-sci teacher would be proud.",
        "name" : "isBalanced",

        "code" : [
            "box.isBalanced = function isBalanced (x) {",
            "    // x is a string. return whether its parentheses are balanced",
            "    // that is, whether every opening ( has a closing )",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 4, "column" : 4 },

        "tests" : [
            { "param" : "", "result" : true },
            { "param" : "(", "result" : false },
            { "param" : "()", "result" : true },
            { "param" : "(1)", "result" : true },
            { "param" : ")(", "result" : false },
            { "param" : "())(()", "result" : false },
            { "param" : "((a()b)c(l(pnq))())", "result" : true },
            { "param" : "((a()b)c(l(pnq))()", "result" : false }
        ]
    },
    {
        "intro" : "Don't you just love arrays?",
        "outro" : "Sorry about the tests cases, I suck at them.",
        "name" : "hasBalancePoint",

        "code" : [
            "box.hasBalancePoint = function hasBalancePoint (x) {",
            "    // x is an array of numbers. return whether there is an index where the sum",
            "    // before (excluding) it is equal to the sum after (including) it.",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        cursor : { "row" : 4, "column" : 4 },

        "tests" : [
            // ...I'm not good at making these up
            { "param" : [],  "result" : true },
            { "param" : [0], "result" : true },
            { "param" : [42, 6, 19, 11, 11, 7], "result" : true },
            { "param" : [1, 2], "result" : false }
            // ...see? told you
        ]
    },
    {
        "intro" : "Closer to the end, more explicit operations",
        "outro" : "Good job! But are you ready for the last challenge...?",
        "name" : "mode",

        "code" : [
            "box.mode = function mode (x) {",
            "    // x is an array of at least 1 item.",
            "    // return the most frequent item (there won't be collisions)",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : { "row" : 4, "column" : 4 },

        "tests" : [
            { "param" : [0], "result" : 0 },
            { "param" : [0, 1, 1, 2], "result" : 1 },
            {
                "param"  : [{}, 0, [1], "foo", true, false, null, true],
                "result" : true
            }
        ]
    },
    {
        "intro" : "Final one! Good luck!",
        "outro" : "Congrats, you win!",
        "name" : "sortingType",

        "code" :[
            "box.sortingType = function sortingType (x) {",
            "    // x is an array of at least 2 unique members",
            "    // return 0 if it's not sorted, 1 if it's ascending, " +
                " -1 if it's descending",
            "    ",
            "    ",
            "};"
        ].join("\n"),

        "cursor" : {
            "row" : 4,
            "column" : 4
        },

        "tests" : [
            { "param" : [0,1],           "result" :  1 },
            { "param" : [-1, 4, 2],      "result" :  0 },
            { "param" : [10, 1, 100],    "result" :  0 },
            { "param" : [0, -1, -100],   "result" : -1 },
            { "param" : [-2, 4, 10, 19], "result" :  1 },
            { "param" : [1, 11, 101],    "result" :  1 },
            { "param" : [101, 11, 1],    "result" : -1 },
            { "param" : [14, -2, 1.5],   "result" :  0 },
            { "param" : [18, 18.1, 19],  "result" :  1 },
            { "param" : [0.9, 0.4, -0.1, -0.12, -1], "result" : -1 }
        ]
    }
]
