const {
    defineConfig,
} = require("eslint/config");

const sonarjs = require("eslint-plugin-sonarjs");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    plugins: {
        sonarjs,
    },

    extends: compat.extends("plugin:sonarjs/recommended"),

    rules: {
        "sonarjs/no-duplicate-string": "error",
        "sonarjs/no-identical-functions": "error",
        "sonarjs/cognitive-complexity": ["error", 15],
        "sonarjs/no-duplicated-branches": "error",
    },
}]);
