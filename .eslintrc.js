module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "settings":{
        "react" : {
            "version" : "detect"
        }
    },
    "plugins": [
        "react",
        "react-native"
      ],
      
      "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "react-native/react-native": true
      },
      "ecmaFeatures": {
        "modules": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    
    
      "rules": {
        "react-native/no-unused-styles": 1,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 0,
        "react-native/no-color-literals": 0,
        "react-native/no-raw-text": 0,
        "no-console": 1,
        "no-debugger": 2,
        "new-cap": 0,
        "strict": 0,
        "no-underscore-dangle": 0,
        "no-use-before-define": 0,
        "eol-last": 0,
        "quotes": [0, "single"],
        "indent": [2, 4],
        "jsx-quotes": [1,"prefer-single"],
        "react/jsx-no-undef": 1,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/prop-types": 0,
        "react/jsx-closing-bracket-location": 0,
        "space-infix-ops": 0,
        "comma-dangle": [2, "never"],
        "prop-types": [0, "never"],
        "no-multi-spaces": [1, {
            "exceptions": {
                "VariableDeclarator": true,
                "ImportDeclaration": true,
                "Property": true
            }
        }],
        "no-multiple-empty-lines": [
            "error", { 
                "max": 1, 
                "maxBOF": 1 
            }
        ]
        
      }
};