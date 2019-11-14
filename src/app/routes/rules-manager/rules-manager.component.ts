import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { STColumn, STPage, STChange, STReq } from '@delon/abc';
import { _HttpClient, SettingsService, MenuService } from '@delon/theme';
import { GetInfoServiceService, ProjectProviderService, ObservableInfoProviderService } from '@core/services';
import { InterfaceStr } from '@core/interface';
import { UtilStatic, utilMessage } from '../../util/util-static';
import { NzMessageService, NzModalService, NzTabsModule  } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { async } from 'rxjs/internal/scheduler/async';

const moment = require('moment');

@Component({
  selector: 'app-rules-manager',
  templateUrl: './rules-manager.component.html',
  styleUrls: ['./rules-manager.component.less'],
  styles: []
})
export class RulesManagerComponent implements OnInit, OnDestroy {
  inputdata = [];
  httpPage:1;
  deteleId: any[] = [];
  currentIndex: 0;
  itemDetail:{};
  dataList: [];
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
  pageData: {};
  keyWord = ``;
  expandKeys = ['100', '1001'];
  isVisible:boolean;
  treevalue: string;
  projectId:number;
  projectRuletype: string;
  projectIndicator: string;
  projectOrg: string;
  projectValue: string;
  projectUproto: string;
  projectProto: string;
  projectKey: string;
  projectOffset: string;
  projectLength: string;
  projectTuples:string;
  projectRemark:string;
  projectSubtype:string;
  projectGroup:string;
  projectPath:string;
  projectSize:string;
  projectRecord: any;
  treenodes = [];
  isLoading: boolean;
  eventContent: Subscription;
  @ViewChild("actionTpl", { static: false }) actionTpl: TemplateRef<{}>;
  @ViewChild("actionTpl2", { static: false }) actionTpl2: TemplateRef<{}>;
  @ViewChild("actionTpl3", { static: false }) actionTpl3: TemplateRef<{}>;
  @ViewChild("actionTpl4", { static: false }) actionTpl4: TemplateRef<{}>;
  @ViewChild("actionTpl5", { static: false }) actionTpl5: TemplateRef<{}>;
  columns: STColumn[];
  columns1: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "subtype", index: "subtype" },
    { title: "indicator", index: "indicator" },
    { title: "value_f", index: "value_f" },
    { title: "uproto", index: "uproto" },
    { title: "remark", index: "remark" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          console.log(record,"record")
          this.itemDetail = record
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectSubtype = record.subtype;
          this.projectRemark = record.remark;
          this.projectIndicator = record.indicator;
          this.projectValue = record.value_f;
          this.projectUproto = record.uproto;
          this.add('编辑', 0, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.deleteObject("one");
          //this.getList("query");
        }
      }]
    },
  ];
  columns2: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "proto", index: "proto" },
    { title: "key_", index: "key_" },
    { title: "uproto", index: "uproto" },
    { title: "remark", index: "remark" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectRemark = record.remark;
          this.projectProto = record.proto;
          this.projectKey = record.key_;
          this.projectUproto = record.uproto;
          this.add('编辑', 1, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.deleteObject("one");
          //this.getList("query");
        }
      }]
    },
  ];
  columns3: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "proto", index: "proto" },
    { title: "offset_f", index: "offset_f" },
    { title: "length", index: "length" },
    { title: "value_f", index: "value_f" },
    { title: "uproto", index: "uproto" },
    { title: "remark", index: "remark" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectRemark = record.remark;
          this.projectProto = record.proto;
          this.projectValue = record.value_f;
          this.projectUproto = record.uproto;
          this.projectLength = record.length;
          this.projectOffset = record.offset_f;
          this.add('编辑', 2, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.deleteObject("one");
          //this.getList("query");
        }
      }]
    },
  ];
  columns4: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "subtype", index: "subtype" },
    { title: "proto", index: "proto" },
    { title: "remark", index: "remark" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectSubtype = record.subtype;
          this.projectRemark = record.remark;
          this.projectProto = record.proto;
          this.add('编辑', 3, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.deleteObject("one");
          //this.getList("query");
        }
      }]
    },
  ];
  columns5: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype"},
    { title: "tuples", index: "tuples" },
    { title: "group_f", index: "group_f" },
    { title: "size", index: "size" },
    { title: "path", index: "path" },
    { title: "remark", index: "remark" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectRemark = record.remark;
          this.projectTuples = record.tuples;
          this.projectGroup = record.group_f;
          this.projectPath = record.path;
          this.projectSize = record.size;
          this.add('编辑', 4, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.deleteObject("one");
          //this.getList("query");
        }
      }]
    },
  ];
  constructor(
    private http: _HttpClient,
    private proSrv: ProjectProviderService,
    private message: NzMessageService,
    private modelSrv: NzModalService,
    private router: Router,
    private settingsService: SettingsService,
    private events: ObservableInfoProviderService
  ) { }

  _onReuseInit() {
    this.getList("query");
  }

  ngOnInit() {
    const getKey = `project`;
    this.eventContent = this.events.currentSelectedPoint(getKey).subscribe(param => {
      const { queryParams } = param as { queryParams: any };
      this.keyWord = queryParams.label;
      delete this.events.obHistoryInfo[getKey];
    });
    if (this.events.obHistoryInfo[getKey]) {
      const { queryParams } = this.events.obHistoryInfo[getKey] as { queryParams: any };
      this.keyWord = queryParams.label;
      delete this.events.obHistoryInfo[getKey];
    }
    this.currentIndex = 0
    this.columns = this.columns1
    this.getList("query");
  }

  showModal(): void {
    console.log(this.deteleId,this.deteleId.length,"this.deteleId")
    if(this.deteleId.length == 0){
      this.message.error("未选择删除项")
      return
    }
    this.isVisible = true;
  }

  handleOk(): void {
    this.deleteObject('array')
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  /**
   * 获取内容
   */
   async changeTab(stChange){
    this.isLoading = true
    this.currentIndex = stChange
    this.pageIndex = 1
    await this.getList("query")
    if(stChange == 0){
      this.columns = this.columns1
    }
    else if(stChange == 1){
      this.columns = this.columns2
    }
    else if(stChange == 2){
      this.columns = this.columns3
    }
    else if(stChange == 3){
      this.columns = this.columns4
    }
    else{
      this.columns = this.columns5
    }
    this.isLoading = false;
  }
  
  changePageData(stChange?: STChange){
    //this.deteleId = stChange
    if(stChange.type == 'checkbox'){
      this.deteleId = []
      let _this = this
      stChange['checkbox'].map(function(item){
        _this.deteleId.push({id:item['id']})
      })
    }
    if(stChange.pi){
      if (stChange.pi != this.pageIndex || stChange.ps != this.pageSize) {
        if (stChange.type === `click` || stChange.type === `dblClick`) {
          return;
        }
        this.pageIndex = stChange.pi;
        this.pageSize = stChange.ps;
        this.getList('query')
      }
    }
  }
  
  async getList(str :string){
    this.isLoading = true;
    let dbname = {}
    if(str == 'select'){
      if(!this.keyWord){
        this.getList('query')
        return
      }
      dbname = {
        dbname:"rule_management",
        filter:[
          {id:this.keyWord},
      ]
      }
    }
    else{
      dbname = {
        dbname:"rule_management",
        page: this.pageIndex - 1,
        count: this.pageSize
      }
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ivr",
      };
    }
    else if(this.currentIndex == 1){
      param = {
        ...dbname,
        tablename: "pkr",
      };
    }
    else if(this.currentIndex == 2){
      param = {
        ...dbname,
        tablename: "polvr",
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "sa",
      };
    }
    var _this = this
    return new Promise((resolve,reject)=>{
      _this.pageData = []
      _this.proSrv.getAllListInfoPost(UtilStatic.host+'getSingleTable', param)
      .subscribe(data => {
        _this.isLoading = false;
        _this.dataList = data['data']
        _this.total = str == 'select' ? data['data'].length : data['allCount'];
        _this.pageData = _this.dataList
        resolve(_this.dataList)
      }, error => {
        _this.isLoading = false;
      });
    })
  }

  /**
   * 新建项目弹窗
   */
  add(nzTitle: string, tpl: number, callBack: any): void {
    if(nzTitle == "新建规则"){
      this.projectRuletype = null;
      this.projectRemark = null;
      this.projectIndicator = null;
      this.projectValue = null;
      this.projectUproto = null;
      this.projectProto = null;
      this.projectKey = null;
      this.projectOffset = null;
      this.projectLength = null;
      this.projectTuples = null;
      this.projectGroup = null;
      this.projectPath = null;
      this.projectSize = null;
      this.projectSubtype = null;
    }
    var tpl2: TemplateRef<{}>
    if(tpl == 0){
      tpl2 = this.actionTpl
    }
    else if(tpl == 1){
      tpl2 = this.actionTpl2
    }
    else if(tpl == 2){
      tpl2 = this.actionTpl3
    }
    else if(tpl == 3){
      tpl2 = this.actionTpl4
    }
    else{
      tpl2 = this.actionTpl5
    }
    this.modelSrv.create({
      nzTitle,
      nzContent: tpl2,
      nzOnOk: () => {
        callBack();
      }
    })
  }

  /**
   * 插入
   */
  addObject = (): void => {
    let dbname = {
      dbname:"rule_management"
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ivr",
        data:{
          ruletype : this.projectRuletype,
          subtype : this.projectSubtype,
          remark :this.projectRemark,
          indicator : this.projectIndicator,
          value_f : this.projectValue,
          uproto : this.projectUproto,
        }
      };
    }
    else if(this.currentIndex == 1){
      param = {
        ...dbname,
        tablename: "pkr",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          proto : this.projectProto,
          key_ : this.projectKey,
          uproto : this.projectUproto,
        }
      };
    }
    else if(this.currentIndex == 2){
      param = {
        ...dbname,
        tablename: "polvr",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          proto : this.projectProto,
          value_f : this.projectValue,
          uproto : this.projectUproto,
          length : this.projectLength,
          offset_f : this.projectOffset,
        }
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
        data:{
          subtype: this.projectSubtype,
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          proto : this.projectProto,
        }
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "sa",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          tuples : this.projectTuples,
          size :this.projectSize,
          group_f : this.projectGroup,
          path: this.projectPath
        }
      };
    }
    this.isLoading = true;
    this.proSrv.addInfoPost(UtilStatic.host+'addData', param)
      .subscribe(data => {
        this.isLoading = false;
        console.log(data,"data")
        if (!data['affectedRows']) {
          this.message.error("添加失败");
          return;
        }
        this.message.success("添加成功");
        this.getList("query");
        this.projectRuletype = null;
        this.projectRemark = null;
        this.projectProto = null;
        this.projectValue = null;
        this.projectUproto = null;
        this.projectLength = null;
        this.projectOffset = null;
        this.projectIndicator = null;
        this.projectTuples = null;
        this.projectKey = null;
        this.projectGroup = null;
        this.projectPath = null;
        this.projectSize = null;
        this.projectSubtype = null;
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 编辑
   */
  editObject = (): void => {
    let dbname = {
      dbname:"rule_management",
      filter:{
        id: this.projectId
      }
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ivr",
        data:{
          ruletype : this.projectRuletype,
          subtype : this.projectSubtype,
          remark :this.projectRemark,
          indicator : this.projectIndicator,
          value_f : this.projectValue,
          uproto : this.projectUproto,
        }
      };
    }
    else if(this.currentIndex == 1){
      param = {
        ...dbname,
        tablename: "pkr",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          proto : this.projectProto,
          key_ : this.projectKey,
          uproto : this.projectUproto,
        }
      };
    }
    else if(this.currentIndex == 2){
      param = {
        ...dbname,
        tablename: "polvr",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          proto : this.projectProto,
          value_f : this.projectValue,
          uproto : this.projectUproto,
          length : this.projectLength,
          offset_f : this.projectOffset,
        }
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
        data:{
          ruletype : this.projectRuletype,
          subtype : this.projectSubtype,
          remark :this.projectRemark,
          proto : this.projectProto,
        }
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "sa",
        data:{
          ruletype : this.projectRuletype,
          remark :this.projectRemark,
          tuples : this.projectTuples,
          size :this.projectSize,
          group_f : this.projectGroup,
          path: this.projectPath
        }
      };
    }
    this.isLoading = true;
    this.proSrv.editInfoPost(UtilStatic.host+'updateData', param)
      .subscribe(data => {
        this.isLoading = false;
        if (!data['affectedRows']) {
          this.message.error('编辑失败');
          return;
        }
        this.message.success('编辑成功');
        this.getList("query");
      }, error => {
        this.isLoading = false;
      })
      this.projectRuletype = null;
      this.projectRemark = null,
      this.projectProto = null;
      this.projectValue = null;
      this.projectUproto = null;
      this.projectLength = null;
      this.projectOffset = null;
      this.projectIndicator = null;
      this.projectTuples = null;
      this.projectKey = null;
      this.projectGroup = null;
      this.projectPath = null;
      this.projectSize = null;
      this.projectSubtype = null;
  }

  /**
   * 删除
   */
  deleteObject = (str : string): void => {
    let dbname = {}
    if(str == "one"){
      dbname = {
        dbname:"rule_management",
        filter:[{
          id: this.projectId
        }]
      }
    }
    else{
      dbname = {
        dbname:"rule_management",
        filter:this.deteleId
      }
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ivr",
      };
    }
    else if(this.currentIndex == 1){
      param = {
        ...dbname,
        tablename: "pkr",
      };
    }
    else if(this.currentIndex == 2){
      param = {
        ...dbname,
        tablename: "polvr",
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "sa",
      };
    }
    this.isLoading = true;
    this.proSrv.deleteInfoPost(UtilStatic.host+'deleteData', param).subscribe(async data => {
      this.isLoading = false;
      if (!data['affectedRows']) {
        this.message.error('删除失败');
        return;
      }
      this.message.success('删除成功');
      //this.pageIndex = 1
      await this.getList("query");
      if(this.dataList.length === 0){
      this.pageIndex = this.pageIndex - 1
      this.getList("query");
      }
      this.deteleId = []
    }, error => {
      this.isLoading = false;
    })
  }

  toCsv(value){
    let str:string = ''
    value.map(function(item,index){
      let strItem = ''
      for(var i in item){
        if(i == 'id'){

        }else{
          strItem = strItem + i + "=" + (value[index][i]||"") + ","
        }
      }
      str = str + strItem + '\r\n'
    })
    return str
  }
  exportCsv () {
    // if(!this.dataList || this.dataList.length == 0){
    //   this.message.error('无数据导出');
    // }
    // else if(this.dataList.length > 0){
      var link = document.getElementById("exportCsv");
      var blob = new Blob(["\uFEFF" + this.toCsv(this.dataList)], { type: 'text/csv;charset=utf-8;' });
      var date = new Date()
      var time = date.getMonth() + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes()
      var filename = "export_file_" + time + ".csv";
      link['download'] = filename;//这里替换为你需要的文件名
      link['href'] = URL.createObjectURL(blob);
    // }
  }
  csvAdd(data : any){
    let _this = this
    data.map(function(item){
    try{
      let dbname = {
        dbname:"rule_management"
      }
      let param = {}
      let data = {}
      let tablename = ''
      for(let i =0;i<item.length;i++){
        //???????????????????????????? remark=11导入后会自动变成数字
        if(item[i] == 37196.000497685185){
          item[i] = 'remark=11'
        }
        if(item[i] == 36892.000497685185){
          item[i] = 'remark=1'
        }
        let arr = item[i].split("=")
        data[arr[0]] = arr[1] || ""
      }
      let index:any = _this.currentIndex
      switch (index) {
        case 0:
          tablename = 'ivr';
          break;
        case 1:
          tablename = 'pkr';
          break;
        case 2:
          tablename = 'polvr';
          break;
        case 3:
          tablename = 'md';
          break;
        default:
          tablename = 'sa';
          break;
      }
      param = {
        ...dbname,
        tablename,
        data:{
          ...data
        }
      }
      _this.proSrv.addInfoPost(UtilStatic.host+'addData', param)
      .subscribe(data => {
        console.log(data,"data")
        if (!data['affectedRows']) {
          _this.message.error("添加失败");
        }
        else{
        _this.message.success("添加成功");
        }
      }, error => {
        
      })
    }catch(e){
        _this.message.error("数据有误")
      }
    })
  }
  //导入csv
  onImportCsv(evt: any) {
/* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1)
    throw new Error('Cannot use multiple files');
    var reader = new FileReader();
    console.log(target['input'])

    this.isLoading = true
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.inputdata = (XLSX.utils.sheet_to_json(ws, {header: 1})); 
      console.log(this.inputdata,"@@@")
      evt.target.value="" // 清空   
      this.csvAdd(this.inputdata)
      this.getList("query")
    };
    this.isLoading = false
    reader.readAsBinaryString(target.files[0]);   
  }

  /**
   * 销毁订阅
   */
  ngOnDestroy(): void {
    console.log(123123);

    this.eventContent.unsubscribe();
  }
}
