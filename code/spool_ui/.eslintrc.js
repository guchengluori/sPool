module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    // 规则，0-忽略-off，1-警告-warn，2-报错-error
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0, // 允许props传播，比如{...props}
    'react/state-in-constructor': 0, // 允许state初始化在构造函数外（dva框架支持简写）
    // 'react/static-property-placement': 0, // es6的class中只有静态方法，没有静态属性
    'react/jsx-fragments': 0, // 允许使用React.Fragment空组件
    'react/no-array-index-key': 1,  // 尽量避免使用array的索引值作为其key值（常用map等遍历中）
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**.js', '**/**.test.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    'no-nested-ternary': 0, // 嵌套三元表达式
    'no-underscore-dangle': 0,  // 下划线开头的变量命名
    'no-plusplus': 'off', // 允许运算符++、--
    'no-unused-expressions': ["error", { "allowShortCircuit": true }], // 允许写法：this.props.test && this.props.test()
    'camelcase': 1, // 需要驼峰式命名
    'react/no-did-update-set-state': 1, // 允许在componentDidUpdate中使用setState方法，注意避免陷入死循环
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
  },
};
