module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 100
      }
    ]
  },
  env: {
    node: true,
    browser: true,
    jest: true,
    es6: true
  },
  parser: "babel-eslint",
  plugins: ["prettier", "react"]
};
