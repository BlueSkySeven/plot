import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { STColumn, STPage, STChange } from '@delon/abc';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UtilStatic, utilMessage } from '../../../util/util-static';
import { SampleSetProviderService, ProjectProviderService } from '@core/services';
import { InterfaceStr } from '@core/interface';
import { SettingsService } from '@delon/theme';

const moment = require('moment');

class Deferred {
  promise: any;
  resolve: any;
  reject: any;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
@Component({
  selector: 'app-sample-set',
  templateUrl: './sample-set.component.html',
  styleUrls: ['./sample-set.component.less'],
  styles: []
})

export class SampleSetComponent implements OnInit {
  userMsg = new SettingsService();
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
  pageData: {};
  keyWord = ``;
  isEdit = false;
  @ViewChild('modalTpl', { static: true }) modalTpl;
  columns: STColumn[] = [
    { title: "编号", index: "sample_number" },
    { title: "仓库类型", index: "warehouse_type" },
    { title: "地址", index: "sample_link", width: `20%`, className: `magenta` },
    { title: "样本集名称", index: "data_name" },
    // { title: "样本集标签", index: "sample_lable" },
    { title: "数据类型", index: "sample_lable_cn" },
    { title: "数据格式", index: "data_format" },
    { title: "数据量", index: "data_size" },
    { title: "创建人", index: "owner" },
    { title: "创建时间", index: "create_time", type: `date` },
    { title: "更新时间", index: "update_time", type: `date` },
    {
      title: "操作", index: "", "buttons": [{
        text: '编辑',
        icon: 'edit',
        type: 'modal',
        click: (record, _modal, comp) => {
          console.log(record);
          this.creatEditModal(record);
          // this.router.navigate(['./training-model/training-object']);
        }
      }, {
        text: '删除',
        icon: 'delete',
        click: (record, _modal, comp) => {
          this.removeModal(record);
          // this.deleteSample(record);
          // this.http.delete(InterfaceStr.deleteProject + record.id).subscribe(data => {
          //   if (!data.affectedRows) {
          //     this.message.error(utilMessage.deleteError);
          //     return;
          //   }
          //   this.message.success(utilMessage.deleteSccess);
          // })
        }
      }]
    },
  ];
  // datasetType: Array<string> = ['Mysql', 'HDFS', 'HBase', 'MongoDB'];
  datasetType: Array<string> = ['Mysql'];
  dataTypeList: Array<any> = [{
    key: 'num',
    name: '数值'
  }, {
    key: 'txt',
    name: '文本'
  }, {
    key: 'img',
    name: '图像'
  }, {
    key: 'audio',
    name: '语音'
  }]
  dataFormatList: Array<string> = ['CSV', 'TXT', 'TEXT', 'String', 'Excel'];
  sampleSetParam = {};
  constructor(
    private message: NzMessageService,
    private modelSrv: NzModalService,
    private sampleSetSev: SampleSetProviderService,
    private proSrv: ProjectProviderService
  ) { }


  ngOnInit() {
    this.getSampleSetList();
  }

  createModal(nzTitle, tpl: TemplateRef<{}>, flag) {
    this.isEdit = flag;
    const me = this;
    this.modelSrv.create({
      nzTitle,
      nzContent: tpl,
      nzOnOk: () => me.addSampleSet(this.sampleSetParam, flag)
    })
  }
  removeModal(data) {
    this.modelSrv.confirm({
      nzTitle: '确定删除该样本集吗?',
      nzContent: '删除该样本集会一同删除绑定的训练集，训练对象。',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteSample(data.id);
      },
      nzCancelText: '否'
    });
  }

  getSampleSetList(stChange?: STChange) {
    if (stChange) {
      this.pageIndex = stChange.pi;
      this.pageSize = stChange.ps;
    }
    const param = {
      url: InterfaceStr.getSampleset,
      _p: this.pageIndex,
      _size: this.pageSize,
      _where: `(data_name,like,~${this.keyWord.trim()}~)`
    }
    this.proSrv.getAllListInfo(InterfaceStr.getAllInfo, { param: JSON.stringify(param) }).subscribe(data => {
      data.results.forEach((e, i) => {
        this.dataTypeList.forEach(dt => {
          if (e.sample_lable === dt.key) {
            e.sample_lable_cn = dt.name;
          }
        });
      });
      this.pageData = data.results;
      this.total = data.info.total;
      if (!data.results.length && this.pageIndex > 1) {
        this.pageIndex--;
        this.getSampleSetList();
      }
    });
  }
  addSampleSet(data, editFlag?) {
    // host: '192.168.11.26',
    // port: '3306',
    // user: 'oozie',
    // password: 'oozie',
    // database: 'test_lmm',
    let linkData;
    const promise = new Deferred();
    if (data.warehouse_type === 'Mysql') {
      linkData = {
        host: data.sample_link,
        port: data.databasePort,
        user: data.username,
        password: data.password,
        database: data.dbname,
        tablename: data.dbTable
      }
    }


    this.sampleSetSev.getMysqlSchema(linkData).subscribe(res => {
      let param;
      const nowTime = new Date();
      const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
      if (res.msg === 'success') {
        param = {
          url: InterfaceStr.getSampleset,
          // editBindUrl:InterfaceStr.getSampleTrainBind,
          data_format: data.data_format,
          data_name: data.data_name,
          sample_lable: data.sample_lable,
          warehouse_type: data.warehouse_type,
          sample_link: JSON.stringify(linkData),
          schema_info: JSON.stringify(res.results.schema),
          sample_number: `sc-${nowTime.getTime()}`,
          data_size: res.results.count,
          create_time: timeStr,
          update_time: timeStr,
          owner: this.userMsg.user.name
        }
        if (!editFlag) {
          // tslint:disable-next-line: no-shadowed-variable
          this.sampleSetSev.sendReq(InterfaceStr.addInfo, { param: JSON.stringify(param) }).subscribe(res => {
            console.log(res);
            this.getSampleSetList();
            if (res.info.msg === 'success') {
              this.message.info('新增数据成功。');
            } else {
              this.message.info('新增数据失败。');
            }
            promise.resolve(res);
          });
        } else {
          param.create_time = moment(new Date(data.create_time)).format(UtilStatic.timeFromat);
          param.id = data.id;
          param.sample_number = data.sample_number;
          // tslint:disable-next-line: no-shadowed-variable
          this.sampleSetSev.sendReq(InterfaceStr.updateInfo, { param: JSON.stringify(param) }).subscribe(res => {
            console.log(res);
            this.getSampleSetList();
            if (res.info.msg === 'success') {
              this.message.info('更新数据成功。');
            } else {
              if (res.results.error.code === 'ER_ROW_IS_REFERENCED_2') {
                this.message.info('该分析流已绑定训练集，无法修改。');
              } else {
                this.message.info('更新数据失败。');
              }
            }
            promise.resolve(res);
          });
        }
      } else {
        if (res.msg === 'paramError') {
          this.message.error('请将数据库信息填写完整。');
        } else {
          this.message.error('保存数据失败，请检查数据库信息是否正确。');
        }
        
        promise.reject(res);
      }
    })
    return promise.promise;
  }
  getSampleTrainBind(sampleId) {
    return new Promise((resolve, reject) => {
      const param = {
        url: InterfaceStr.getSampleTrainBind,
      }
      this.proSrv.getAllListInfo(InterfaceStr.getAllInfo, { param: JSON.stringify(param) }).subscribe(data => {
        resolve(data.results);
      });
    })

  }
  deleteSampleTrainBind(id){
    return new Promise((resolve, reject) => {
      const param = {
        url: InterfaceStr.getSampleTrainBind,
        id
      }
      this.sampleSetSev.sendReq(InterfaceStr.deleteInfo, { param: JSON.stringify(param) }).subscribe(res => {
        resolve(res)
      })
    })
  }

  deleteBindErg(dataArray){
    const promiseArr = [];
    dataArray.forEach(data=>{
      promiseArr.push(this.deleteSampleTrainBind(data.id))
    });
    return dataArray;
  }

  deleteSample(data) {
    this.sampleSetSev.deleteBind(data,'sample').subscribe(res => {
      if (res.results === 'success') {
        this.getSampleSetList();
      }
    })
  }
  creatEditModal(data) {
    const temp = JSON.parse(data.sample_link)
    const transData = {
      sample_link: temp.host,
      databasePort: temp.port,
      username: temp.user,
      password: temp.password,
      dbname: temp.database,
      dbTable: temp.tablename
    }
    this.sampleSetParam = { ...data, ...transData }

    this.createModal('编辑样本', this.modalTpl, true);
  }
  getSchema() {
    const param = {
      host: '192.168.11.26',
      port: '3306',
      user: 'oozie',
      password: 'oozie',
      database: 'test_lmm',
      tablename: 'boston_price'
    };
    this.sampleSetSev.getMysqlSchema(param).subscribe(res => {
      console.log(JSON.stringify(res));
    })
  }
}
