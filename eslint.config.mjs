export default [{
    rules: {
        indent: ["warn", 2],
        "import/no-spaces-between-exports": "off",
        "no-duplicate-imports": "warn",
        "object-curly-spacing": ["warn", "always"],
    },
    overrides: {
        "files": ["tests/**/*"],
        "env": {
            "jest": true
        }
    }
}];