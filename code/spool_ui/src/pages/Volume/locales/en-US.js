export default {
  // 公共参数
  'common.opt.add': 'Add',
  'common.opt.edit': 'Edit',
  'common.opt.del': 'Delete',
  'common.opt.clone': 'Clone',
  'common.opt.del.select.one': 'Please select at least one record',
  'common.opt.import': 'Import',
  'common.opt.oper': 'Operation',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.required': 'Required',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.copy': 'Copy',
  'common.copy.success': 'Copy success',
  'common.select.file': 'Please select upload file',
  'common.opt.export': 'Export',
  'common.opt.setting': 'Setting',
  'common.opt.query': 'Query',
  'common.opt.query.tips': 'Input search text',
  'common.opt.reset': 'Reset',
  'common.readonly': 'ReadOnly',
  'common.write': 'ReadAndWrite',
  'common.opt.start': 'Start',
  'common.opt.stop': 'Stop',
  'common.more': 'More',
  'common.details': 'Details',

  // 卷列表管理
  'param.volume.sn': 'NO.',
  'param.volume.name': 'Name',
  'param.volume.type': 'Type',
  'param.volume.status': 'State',
  'param.volume.cluster': 'Cluster',
  'param.volume.transport': 'Transport type',
  'param.volume.id': 'ID',
  'param.volume.nfs_disabled': 'NFS Disabled',
  'param.volume.split_brain': 'SplitBrain',
  'param.volume.start': 'Start',
  'param.volume.stop': 'Stop',
  'param.volume.replace': 'Replace',
  'param.volume.show': 'Show ',
  'param.volume.detail': ' Details',
  'param.volume.state.started': 'Started',
  'param.volume.state.stopped': 'Stopped',
  'param.volume.state.created': 'Created',
  'param.volume.state.error': 'Error',
  'param.volume.state.pending': 'Pending',
  'param.volume.delete.validate': 'Please stop the disk volume first, and delete it again!',
  'param.volume.delete.confirm': 'Are you sure you want to delete the volume?',
  'param.volume.stop.confirm':
    'After the disk volume stops, the data on the disk volume will not be accessible! Are you sure you want to stop the current volume',
  'param.volume.start.confirm': 'Are you sure you want to start the current volume?',
  'param.volume.start.confirm.title': 'Startup confirmation',
  'param.volume.stop.confirm.title': 'Stop confirmation',
  'param.volume.start.force': 'Force start?',
  'param.volume.stop.force': 'Forced stop?',

  // 卷新增
  'param.volume.add.title': 'New Volume',
  'param.volume.edit.title': 'Modify Volume',
  'param.volume.name.validate': 'Please enter a volume name',
  'param.volume.name.required.validate': 'Volume name is required',
  'param.volume.type.validate': 'Please select a volume type',
  'param.volume.type.required.validate': 'Volume type is required',
  'param.volume.transport.validate': 'Please select the transport type',
  'param.volume.transport.required.validate': 'Transport type is required',
  'param.volume.cluster.required.validate': 'Attribution cluster is required',
  'param.volume.cluster.validate': 'Please select the attribution cluster',
  'param.volume.Brick': 'Brick',
  'param.volume.Brick.node': 'Host',
  'param.volume.Brick.catalog': 'Dir',
  'param.volume.arbBrick': 'ArbBrick',
  'param.volume.brick.required': 'Brick is required',
  'param.volume.arbbrick.required':
    'Arbitration volume switch has been turned on, arbitration brick is required! If arbitration volume is not required, turn off the switch',
  'param.volume.brickparam.required': 'Brick params is required',
  'param.volume.brick.number.validate':
    'When the volume type is "Replicate" copy volume, the number of Brick is at least 2. If it grows up, it needs to increase in pairs, and 4,6,8 in turn.',
  'param.volume.arbbrick.number.validate':
    'If the volume type is "Replicate" copy volume, if the arbitration volume is opened, the number of arbitral Brick should be 1/2 of Brick number.',
  'param.volume.current.cluster': 'In the current cluster ',
  'param.volume.volumename.already.exist': ' name already exists',
  'param.volume.volumename.validate':
    'The name must start with a letter, at least 6 characters, not more than 16, and cannot contain Chinese.',
  'param.volume.brickdir.required': 'The directory must not be empty, and must start with "/".',
  'param.volume.brick': 'Host',
  'param.volume.brick.select': 'Please select a node',
  'param.volume.brickdir': 'Dir',

  // 卷详情页
  'param.volume.detail.id': 'ID',
  'param.volume.detail.type': 'Type',
  'param.volume.detail.transport': 'Transport Type',
  'param.volume.detail.nfs': 'NFS Disabled',
  'param.volume.detail.splitbrain': 'SplitBrain',
  'param.volume.detail.tab.info': 'Details',
  'param.volume.detail.tab.statistics': 'Data Statistics',
  'param.volume.detail.bricklist': 'Brick List',
  'param.volume.detail.client': 'Client',
  'param.volume.detail.param': 'Params Setting',
  'param.volume.detail.param.desc': 'The list shows the modified params  ',
  'param.volume.detail.param.showall': 'Show All Params',

  // 详情-Brick列表
  'param.volume.bricklist.sn': 'No.',
  'param.volume.bricklist.name': 'Name',
  'param.volume.bricklist.pid': 'PID',
  'param.volume.bricklist.state': 'State',
  'param.volume.bricklist.arbiter': 'Arbitral brick',
  'param.volume.bricklist.notarbiter': 'Non arbitral brick',
  'param.volume.bricklist.tcpport': 'TCP Port',
  'param.volume.bricklist.rdmaport': 'RDMA Port',
  'param.volume.bricklist.disk': 'Disk usage(Free/Total)',
  'param.volume.bricklist.inode': 'Inode usrage(Free/Total)',
  'param.volume.bricklist.belong_cluster': 'Attribution cluster',
  'param.volume.bricklist.file': 'File',
  'param.volume.bricklist.device': 'Device',
  'param.volume.bricklist.mount_options': 'Mount Options',
  'param.volume.bricklist.inode_size': 'Inode Size',

  // 详情-参数列表
  'param.volume.param.name': 'Param Name',
  'param.volume.param.value': 'Param Value',
  'param.volume.param.valueset': 'Param Set',
  'param.volume.param.valueset.desc':
    'Modify parameters directly by directly clicking parameter values.',

  // 详情-客户端列表
  'param.volume.client.brick': 'Brick',
  'param.volume.client.connect': 'Connection number',
  'param.volume.client.detail': 'Client Details',
  'param.volume.client.host': 'Host Name',

  // 详情-统计数据
  'param.volume.statistics.brick': 'Brick',
  'param.volume.statistics.type': 'Type',
  'param.volume.statistics.count': 'Count',
  'param.volume.statistics.filename': 'Filename',
  'param.volume.replace.title': 'Brick Replace',
  'param.volume.relpace.param.notnull':
    'The volume replacement parameter cannot be empty. Please enter the parameter and click save.',
};