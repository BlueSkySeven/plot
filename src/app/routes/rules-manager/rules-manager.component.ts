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
    { title: "indicator", index: "indicator" },
    { title: "value", index: "value" },
    { title: "uproto", index: "uproto" },
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
          this.projectIndicator = record.indicator;
          this.projectValue = record.value;
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
          this.getList("query");
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
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
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
          this.getList("query");
        }
      }]
    },
  ];
  columns3: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "proto", index: "proto" },
    { title: "offset", index: "offset" },
    { title: "length", index: "length" },
    { title: "value", index: "value" },
    { title: "uproto", index: "uproto" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectProto = record.proto;
          this.projectValue = record.value;
          this.projectUproto = record.uproto;
          this.projectLength = record.length;
          this.projectOffset = record.offset;
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
          this.getList("query");
        }
      }]
    },
  ];
  columns4: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "proto", index: "proto" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
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
          this.getList("query");
        }
      }]
    },
  ];
  columns5: STColumn[] = [
    { title: '选框',index: 'id',type: 'checkbox'},
    { title: "编号", index: "id" },
    { title: "ruletype", index: "ruletype" },
    { title: "tuples", index: "tuples" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectId = record.id;
          this.projectRuletype = record.ruletype;
          this.projectTuples = record.tuples;
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
          this.getList("query");
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

  /**
   * 获取内容
   */
   async changeTab(stChange){
    this.isLoading = true
    this.currentIndex = stChange
    this.pageIndex = 1
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
    await this.getList("query")
    this.isLoading = false;

  }
  changePageData(stChange?: STChange){
    //this.deteleId = stChange
    
    console.log(stChange)
    if(stChange.type == 'checkbox'){
      this.deteleId = []
      let _this = this
      stChange['checkbox'].map(function(item){
        _this.deteleId.push({id:item['id']})
      })
      console.log(this.deteleId)
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
  getList(str :string){
    let dbname = {}
    if(str == 'select'){
      if(!this.keyWord){
        return
      }
      dbname = {
        dbname:"rule_management",
        filter:[
          {id:this.keyWord},
      ],
      }
    }
    else{
      dbname = {
        dbname:"rule_management",
        page: this.pageIndex - 1,
        count: this.pageSize
      }
      console.log
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
    var _this = this
    return new Promise(function(){
      _this.pageData = []
      _this.proSrv.getAllListInfoPost('http://192.168.21.6:3001/getSingleTable', param)
      .subscribe(data => {
        _this.isLoading = false;
        _this.dataList = data['data']
        _this.total = str == 'select' ? data['data'].length : data['allCount'];
        _this.pageData = _this.dataList
        
      }, error => {
        _this.isLoading = false;
      });
    })
  }

  /**
   * 新建项目弹窗
   */
  add(nzTitle: string, tpl: number, callBack: any): void {
    if(nzTitle == "创建项目"){
      this.projectRuletype = null;
      this.projectIndicator = null;
      this.projectValue = null;
      this.projectUproto = null;
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
          indicator : this.projectIndicator,
          value : this.projectValue,
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
          proto : this.projectProto,
          value : this.projectValue,
          uproto : this.projectUproto,
          length : this.projectLength,
          offset : this.projectOffset,
        }
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
        data:{
          ruletype : this.projectRuletype,
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
          tuples : this.projectTuples,
        }
      };
    }
    this.isLoading = true;
    this.proSrv.addInfoPost('http://192.168.21.6:3001/addData', param)
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
        this.projectProto = null;
        this.projectValue = null;
        this.projectUproto = null;
        this.projectLength = null;
        this.projectOffset = null;
        this.projectIndicator = null;
        this.projectTuples = null;
        this.projectKey = null;
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
          indicator : this.projectIndicator,
          value : this.projectValue,
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
          proto : this.projectProto,
          value : this.projectValue,
          uproto : this.projectUproto,
          length : this.projectLength,
          offset : this.projectOffset,
        }
      };
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
        data:{
          ruletype : this.projectRuletype,
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
          tuples : this.projectTuples,
        }
      };
    }
    this.isLoading = true;
    this.proSrv.editInfoPost('http://192.168.21.6:3001/updateData', param)
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
      this.projectProto = null;
      this.projectValue = null;
      this.projectUproto = null;
      this.projectLength = null;
      this.projectOffset = null;
      this.projectIndicator = null;
      this.projectTuples = null;
      this.projectKey = null;
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
      if(this.deteleId.length == 0){
        this.message.error("未选择删除项")
        return
      }
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
    this.proSrv.deleteInfoPost('http://192.168.21.6:3001/deleteData', param).subscribe(data => {
      this.isLoading = false;
      if (!data['affectedRows']) {
        this.message.error('删除失败');
        return;
      }
      this.message.success('删除成功');
      this.getList("query");
    }, error => {
      this.isLoading = false;
    })
  }
  csvAdd(data : any){
    let _this = this
    data.map(function(item){
      let dbname = {
        dbname:"rule_management"
      }
      let param = {}
      if(_this.currentIndex == 0){
        param = {
          ...dbname,
          tablename: "ivr",
          data:{
            ruletype : item[0],
            indicator : item[1],
            value : item[2],
            uproto : item[3],
          }
        };
      }
      else if(_this.currentIndex == 1){
        param = {
          ...dbname,
          tablename: "pkr",
          data:{
            ruletype : item[0],
            proto : item[1],
            key_ : item[2],
            uproto : item[3],
          }
        };
      }
      else if(_this.currentIndex == 2){
        param = {
          ...dbname,
          tablename: "polvr",
          data:{
            ruletype : item[0],
            proto : item[1],
            value : item[2],
            uproto : item[3],
            length : item[4],
            offset : item[5],
          }
        };
      }
      else if(_this.currentIndex == 3){
        param = {
          ...dbname,
          tablename: "md",
          data:{
            ruletype : item[0],
            proto : item[1],
          }
        };
      }
      else{
        param = {
          ...dbname,
          tablename: "sa",
          data:{
            ruletype : item[0],
            tuples : item[1],
          }
        };
      }
      _this.proSrv.addInfoPost('http://192.168.21.6:3001/addData', param)
      .subscribe(data => {
        console.log(data,"data")
        if (!data['affectedRows']) {
          _this.message.error("添加失败");
          return;
        }
        _this.message.success("添加成功");
      }, error => {
        
      })
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
      console.log("!!!")
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.inputdata = (XLSX.utils.sheet_to_json(ws, {header: 1})); 
      console.log(this.inputdata)
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
