/*
 * @Author: C.
 * @Date: 2022-08-25 23:17:51
 */
module.exports = {
    root: true,
    env: {
        node: true
    },
    plugins: ["prettier"],
    extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "prettier/prettier": "off"
    },
    globals: {
        // 不希望被eslint报错的全局变量
        AMap: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        parser: "babel-eslint"
    }
};
