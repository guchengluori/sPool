const prompt = require('prompt');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const echo = content => {
  process.stdout.write(`${content}\n`);
};

const template = `import React from 'react';

const Index = () => (
  <div>This is Index</div>
);

export default Index;`;

function compileFolder({ name }) {
  const root = path.join(__dirname, '..', 'src/pages', name);
  if (fs.existsSync(root)) {
    throw new Error(`模块${name}已经存在！`);
  }
  echo(`${chalk.yellow('创建文件')}${chalk.blue(name)}`);
  fs.mkdirSync(root);

  echo(`${chalk.yellow('创建components')}`);
  fs.mkdirSync(path.join(root, 'components'));
  echo(`${chalk.yellow('创建messages')}`);
  fs.mkdirSync(path.join(root, 'messages'));
  echo(`${chalk.yellow('创建models')}`);
  fs.mkdirSync(path.join(root, 'models'));
  echo(`${chalk.yellow('创建services')}`);
  fs.mkdirSync(path.join(root, 'services'));
  echo(`${chalk.yellow('创建index.js')}`);
  fs.writeFileSync(path.join(root, 'index.js'), template);
  echo(`${chalk.green('创建完成')}`);
}

prompt.start();
prompt.get(
  {
    properties: {
      name: {
        pattern: /^([A-Z][a-zA-Z]+)$/,
        description: '模块的名称',
        message: '名字只能是字母，首字母大写(大驼峰式命名)',
        required: true,
      },
    },
  },
  (err, result) => {
    if (!err) {
      compileFolder(result);
    }
  }
);
