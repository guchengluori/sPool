// 代码中会兼容本地 service mock 以及部署站点的静态数据
let currentUser = {};

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req, res) => {
    if (Object.keys(currentUser).length > 0) {
      const { userName, password } = currentUser;
      if (userName === 'admin' && password === '11') {
        res.send({
          name: userName,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
          email: '0027008888@iwhalecloud.com',
          title: '前端专家',
          group: '平台技术产品部-前端框架团队-Fish团队',
          phone: '025-268888888',
        });
        return;
      }
    }
    res.send({});
  },
  'GET /api/logout': (req, res) => {
    currentUser = {};
    res.send({
      status: 'ok',
    });
  },
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '11' && userName === 'admin') {
      currentUser = {
        userName,
        password,
      };
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'guest',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
};
