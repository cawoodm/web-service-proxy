import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("strongloop"), {
    languageOptions: {
        globals: {
            ...globals.jest,
            ...globals.node,
        },

        ecmaVersion: 2020,
        sourceType: "commonjs",
    },

    rules: {
        "max-len": "off",
        quotes: ["error", "single"],
        "object-curly-spacing": ["error", "never"],
        "quote-props": "off",
        "block-spacing": "off",
        "space-before-function-paren": "off",
        complexity: ["warn", 10],
        "require-await": "error",
    },
}];