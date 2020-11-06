module.exports = {
    parserOptions: {
        "ecmaVersion": 2017,
        "sourceType": "module"
    }, 
    plugins: ["promise", "prettier", "jest"],
    rules: {
        "prettier/prettier": "error",

        "no-unused-vars": [
            "error",
            {
                args: "after-used",
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],

        // Removed rule "disallow the use of undeclared variables unless mentioned in /*global */ comments" from recommended eslint rules
        "no-undef": "off",

        // Require the use of === and !==
        "eqeqeq": 2,

        // Require using Error objects as Promise rejection reasons
        "prefer-promise-reject-errors": 2,

        // Prefer using arrow functions for callbacks
        "prefer-arrow-callback": 1,

        // Return inside each then() to create readable and reusable Promise chains.
        // Forces developers to return console logs and http calls in promises.
        "promise/always-return": 2,

        //Enforces the use of catch() on un-returned promises
        "promise/catch-or-return": 2,

        // Warn against nested then() or catch() statements
        "promise/no-nesting": 1
    }, 
    extends: ["eslint:recommended", "plugin:prettier/recommended", "plugin:jest/recommended"]
}