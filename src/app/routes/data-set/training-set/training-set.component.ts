import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { STColumn, STPage, STChange, FooterToolbarComponent } from '@delon/abc';
import { _HttpClient,SettingsService } from '@delon/theme';
import { GetInfoServiceService, ProjectProviderService, SampleSetProviderService } from '@core/services';
import { InterfaceStr } from '@core/interface';
import { UtilStatic, utilMessage } from '../../../util/util-static';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
const moment = require('moment');

@Component({
  selector: 'app-training-set',
  templateUrl: './training-set.component.html',
  styleUrls: ['./training-set.component.less'],
  styles: []
})
export class TrainingSetComponent implements OnInit {
  userMsg = new SettingsService();
  @ViewChild('contTpl', { static: true }) contTpl;
  @ViewChild('footTpl', { static: true }) footTpl;
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
  pageData: {};
  keyWord = ``;
  model;
  selectedSampleSet;
  step = 1;
  trainSetData: {
    'train_title'?: any,
    'data_size_percent'?: any,
    'train_test_rate'?: any
  } = {
    'data_size_percent': 1,
    'train_test_rate': 0.2
  };
  schemaList = [];
  selectedSchemaList = [];
  percentList = [
    { key: 0.1, name: '10%' },
    { key: 0.2, name: '20%' },
    { key: 0.3, name: '30%' },
    { key: 0.4, name: '40%' },
    { key: 0.5, name: '50%' },
    { key: 0.6, name: '60%' },
    { key: 0.7, name: '70%' },
    { key: 0.8, name: '80%' },
    { key: 0.9, name: '90%' },
    { key: 1, name: '100%' },
  ]
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

  columns: STColumn[] = [
    { title: "编号", index: "train_number" },
    { title: "训练集名称", index: "train_title" },
    { title: "地址", index: "train_link", width: `20%`, className: `magenta` },
    { title: "数据格式", index: "data_format" },
    { title: "数据类型", index:"sample_lable_cn"},
    { title: "数据量", index: "data_size" },
    { title: "训练集比例", index: "data_size_percent_cn" },
    { title: "测试集比例", index:"train_test_rate_cn"},
    { title: "创建人", index: "operater" },
    { title: "创建时间", index: "create_time",type: `date` },
    { title: "更新时间", index: "update_time",type: `date` },
    {
      title: "操作", index: "", "buttons": [
      // {
      //   text: '编辑',
      //   icon: 'edit',
      //   type: 'modal',
      //   click: (record, _modal, comp) => {

      //   }
      // }, 
      {
        text: '删除',
        icon: 'delete',
        click: (record, _modal, comp) => {
          this.removeModal(record.id);
        }
      }]
    }
  ];
  sampleSetList: Array<any>;
  samplePageConf = {
    page: {
      front: false,// 后端分页
      pageSizes: [5, 10],
      showSize: true,
      total: true,
      show: true,
      showQuickJumper: true
    },
    pageIndex: 1,
    pageSize: 5,
    total: 0
  }
  sampleSetcolumns: STColumn[] = [
    { title: '选择', index: 'id', type: 'radio', width: `30px` },
    { title: "仓库类型", index: "warehouse_type" },
    { title: "样本集名称", index: "data_name" },
    { title: "样本集标签", index: "sample_lable" },
    { title: "创建人", index: "owner" },
    { title: "更新时间", index: "update_time",type: `date` }
  ]


  constructor(
    private http: _HttpClient,
    private proSrv: ProjectProviderService,
    private message: NzMessageService,
    private modelSrv: NzModalService,
    private sampSrv: SampleSetProviderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTraintList();
  }

  /**
   * 获取内容
   */
  getTraintList(stChange?: STChange): void {
    if (stChange) {
      this.pageIndex = stChange.pi;
      this.pageSize = stChange.ps;
    }
    const param = {
      url: InterfaceStr.getTrainSet,
      _p: this.pageIndex,
      _size: this.pageSize,
      _where: `(train_title,like,~${this.keyWord.trim()}~)`
    }
    this.proSrv.getAllListInfo(InterfaceStr.getAllInfo, { param: JSON.stringify(param) }).subscribe(data => {
      data.results.forEach(item => {
        this.dataTypeList.forEach(dt => {
          if (item.sample_lable === dt.key) {
            item.sample_lable_cn = dt.name;
          }
        });
        this.percentList.forEach(pt => {
          if (parseFloat(item.data_size_percent) === pt.key) {
            item.data_size_percent_cn = pt.name;
          }
          if (parseFloat(item.train_test_rate) === pt.key) {
            item.train_test_rate_cn = pt.name;
          }
        })
      })
      this.pageData = data.results;
      this.total = data.info.total;
      if (!data.results.length && this.pageIndex > 1) {
        this.pageIndex--;
        this.getTraintList();
      }
    });
  }
  getSampleSetList(stChange?: STChange) {
    if (stChange) {
      this.samplePageConf.pageIndex = stChange.pi;
      this.samplePageConf.pageSize = stChange.ps;
    }
    const param = {
      url: InterfaceStr.getSampleset,
      _p: this.samplePageConf.pageIndex,
      _size: this.samplePageConf.pageSize,
      _where: `(data_name,like,~~)`
    }
    this.proSrv.getAllListInfo(InterfaceStr.getAllInfo, { param: JSON.stringify(param) }).subscribe(data => {
      this.sampleSetList = data.results;
      this.samplePageConf.total = data.info.total;
      if (!data.results.length && this.samplePageConf.pageIndex > 1) {
        this.samplePageConf.pageIndex--;
        this.getSampleSetList();
      }
    });
  }
  goStep(num) {
    this.step = num;
  }
  featureChange(ret) {
    const temp = [];
    if (ret.from === 'left') {
      ret.list.forEach(item => {
        const copyObj = { ...item }
        copyObj.direction = 'left';
        temp.push(copyObj);
      })
      this.selectedSchemaList = [...this.selectedSchemaList, ...temp];
    } else if (ret.from === 'right') {
      ret.list.forEach(item => {
        this.selectedSchemaList.splice(this.selectedSchemaList.findIndex(selected => selected.key === item.key), 1);
      })
    }
  }

  /**
   * 弹窗
   */
  openTrainSetModel(nzTitle: string, contTpl: TemplateRef<{}>, footTpl: TemplateRef<{}>): void {
    // this.selectedSampleSet = null;
    // this.trainSetData = null;
    this.step = 1;
    this.getSampleSetList();
    this.schemaList = [];
    this.model = this.modelSrv.create({
      nzTitle,
      nzContent: contTpl,
      nzFooter: footTpl,
      nzWidth: 700
    })
  }
  closeModel() {
    this.model.destroy();
  }
  handleStChange(evt) { 
    if (evt.type === 'radio') {
      this.selectRow(evt);
    } else {
      this.getSampleSetList(evt)
      
    }
  }
  selectRow(evt): void {
    this.selectedSchemaList = [];
    const me = this;
    if (evt.type === 'radio') {
      me.selectedSampleSet = evt.radio;
      const schema = JSON.parse(me.selectedSampleSet.schema_info);
      const temp = [];
      schema.forEach(item => {
        temp.push({ key: item.COLUMN_NAME, title: item.COLUMN_NAME });
      });
      me.schemaList = temp;
    }
  }
  savaClick() {
    this.addTrainSet();
    this.model.destroy();
  }
  /**
   * 创建
   */
  addTrainSet = (): void => {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    const featuresArr = [];
    const lableArr = [];
    this.selectedSchemaList.forEach(item => {
      if (item.direction === 'left') {
        featuresArr.push(item);
      } else {
        lableArr.push(item);
      }
    })
    const features = [];
    const lables = [];
    featuresArr.forEach(i=>{
      features.push(i.key);
    })
    lableArr.forEach(i=>{
      lables.push(i.key);
    })
    const param = {
      url: InterfaceStr.getTrainSet,
      train_number: `pj-${nowTime}`,
      train_title: this.trainSetData.train_title,
      train_link: this.selectedSampleSet.sample_link,
      data_size: this.selectedSampleSet.data_size,
      operater: this.userMsg.user.name,
      data_format: this.selectedSampleSet.data_format,
      sample_lable: this.selectedSampleSet.sample_lable,
      data_size_percent: this.trainSetData.data_size_percent,
      train_test_rate: this.trainSetData.train_test_rate,
      features:features.join(','),
      lable: lables.join(','),
      create_time: timeStr,
      update_time: timeStr
    };
    this.proSrv.addInfo(InterfaceStr.addInfo, { param: JSON.stringify(param) }).subscribe(data => {
      if (data.info.msg === `fail`) {
        this.message.error(utilMessage.insertError);
        return;
      }
      this.addSampleTrainBind(data.results.insertId);
      this.message.success(utilMessage.insertSccess);
      this.getTraintList();
    })
  }
  editTrainSet(trainSet){
    this.trainSetData={
      'train_title':trainSet.train_title,
      'data_size_percent':trainSet.data_size_percent,
      'train_test_rate':trainSet.train_test_rate
    }
  }

  addSampleTrainBind(trainId) {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    const featuresArr = [];
    const lableArr = [];
    this.selectedSchemaList.forEach(item => {
      if (item.direction === 'left') {
        featuresArr.push(item);
      } else {
        lableArr.push(item);
      }
    })
    const param = {
      url: InterfaceStr.getSampleTrainBind,
      t_train_sets_id: trainId,
      t_sample_id: this.selectedSampleSet.id,
      create_time: timeStr
    };
    this.proSrv.addInfo(InterfaceStr.addInfo, { param: JSON.stringify(param) }).subscribe(data => {
      if (data.info.msg === `fail`) {
        this.message.error(utilMessage.insertError);
        return;
      }
      this.message.success(utilMessage.insertSccess);
      this.getTraintList();
    })
  }
  removeModal(data) {
    this.modelSrv.confirm({
      nzTitle: '确定删除该训练集吗?',
      nzContent: '删除该训练集会同时删除绑定的训练模型，请谨慎操作。',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteTrainSet(data);
      },
      nzCancelText: '否'
    });
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
      this.sampSrv.sendReq(InterfaceStr.deleteInfo, { param: JSON.stringify(param) }).subscribe(res => {
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
  deleteTrainSet(trainId) {
    this.sampSrv.deleteBind(trainId,'train').subscribe(res => {
      if (res.results === 'success') {
        this.getTraintList();
      }
    })
    // this.getSampleTrainBind(trainId).then(data=>{
    //   Promise.all(this.deleteBindErg(data)).then(()=>{
    //     const param = {
    //       url: InterfaceStr.getTrainSet,
    //       id: trainId
    //     }
    //     this.sampSrv.sendReq(InterfaceStr.deleteByCondition, { param: JSON.stringify(param) }).subscribe(res => {
    //       let msg;
    //       if(res.info.msg=='fail'){
    //         this.message.error(`删除失败，请联系管理员。`);
    //       }else{
    //         msg = '删除数据成功。';
    //         this.message.success(msg);
    //         this.getTraintList();
    //       }
    //     })
    //   })
    // })
    
    
  }

}