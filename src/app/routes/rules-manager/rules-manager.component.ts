import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { STColumn, STPage, STChange, STReq, STData } from '@delon/abc';
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
  state:string;
  selectConditions:object;
  isHadloaded = false;
  selectType = "";
  allType = [];
  inputdata = [];
  httpPage:1;
  currentData:any[];
  deleteId: any[];
  undeleteId:any[];
  undeleteIdAll:any[];
  deleteIdAll: any[];
  isSelectedAll:boolean;
  currentIndex: number;
  itemDetail:{};
  dataList: [];
  dataAllList: any;
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
  pageData: {};
  keyWord = ``;
  isVisible:boolean;
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
    { title: "规则类型", index: "ruletype" },
    { title: "类则子类", index: "subtype" },
    { title: "指示", index: "indicator" },
    { title: "指示值", index: "value_f" },
    { title: "上层协议", index: "uproto" },
    { title: "备注", index: "remark" },
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
    { title: "规则类型", index: "ruletype" },
    { title: "协议", index: "proto" },
    { title: "特征码", index: "key_" },
    { title: "上层协议", index: "uproto" },
    { title: "备注", index: "remark" },
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
    { title: "规则类型", index: "ruletype" },
    { title: "协议", index: "proto" },
    { title: "偏移量", index: "offset_f" },
    { title: "长度", index: "length" },
    { title: "偏移值", index: "value_f" },
    { title: "上层协议", index: "uproto" },
    { title: "备注", index: "remark" },
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
    { title: "规则类型", index: "ruletype" },
    { title: "类则子类", index: "subtype" },
    { title: "协议", index: "proto" },
    { title: "备注", index: "remark" },
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
    { title: "规则类型", index: "ruletype"},
    { title: "规则内容", index: "tuples" },
    { title: "组合", index: "group_f" },
    { title: "输出文件大小", index: "size" },
    { title: "输出相对路径", index: "path" },
    { title: "备注", index: "remark" },
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
    this.deleteId = []
    this.deleteIdAll = []
    this.undeleteId = []
    this.undeleteIdAll = []
    this.isSelectedAll = false
    this.columns = this.columns1
    this.getList("query");
  }

  showModal(): void {
    if(this.deleteIdAll.length == 0 && !this.isSelectedAll){
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
    this.deleteId = []
    this.deleteIdAll = []
    this.undeleteId = []
    this.undeleteIdAll = []
    this.isSelectedAll = false
    this.isHadloaded = false
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

  newArr(arr){
    for(var i=0;i<arr.length;i++){
        for(var j=i+1;j<arr.length;j++)
            if(arr[i].id==arr[j].id){ 
            //如果第一个等于第二个，splice方法删除第二个
            arr.splice(j,1);
            j--;
            }
        }
    return arr;
  }
  provinceChange(value: string): void {
    console.log(value)
  }
  selectAll(){
    this.isSelectedAll = !this.isSelectedAll
    this.deleteIdAll = []
    this.deleteId = []
    this.undeleteId = []
    this.undeleteIdAll = []
    this.getList(this.state)
  }
  dataChange(data: STData[]){
    this.currentData = data

    var arr = this.deleteIdAll.map(function(item){
      return item.id
    })
    var undeleteArr = this.undeleteIdAll.map(function(item){
      return item.id
    })
    return data.map((i: STData, index: number) => {
      if(this.isSelectedAll){
        i.checked = true
        if(undeleteArr.indexOf(i.id) >= 0){
          i.checked = false
        }
      }
      else{
      i.checked = arr.indexOf(i.id) >= 0;
      }
      return i;
    });
  }
  changePageData(stChange?: STChange){
    console.log(this.deleteIdAll,"deleteIdAll")
    console.log(this.undeleteIdAll,"undeleteIdAll")
    this.undeleteId = this.newArr(this.undeleteId)
    this.undeleteIdAll = this.newArr(this.undeleteIdAll.concat(this.undeleteId))
    this.deleteIdAll = this.newArr(this.deleteIdAll.concat(this.deleteId))
    if(!this.isSelectedAll){
      for(let i=0;i<this.undeleteId.length;i++){
        for(let j=0;j<this.deleteIdAll.length;j++){
          if(this.undeleteId[i].id == this.deleteIdAll[j].id){
            this.deleteIdAll.splice(j,1)
          }
        }
      }
    }
    else{
      for(let i=0;i<this.deleteId.length;i++){
        for(let j=0;j<this.undeleteIdAll.length;j++){
          if(this.deleteId[i].id == this.undeleteIdAll[j].id){
            this.undeleteIdAll.splice(j,1)
          }
        }
      }
    }
    if(stChange.type == 'checkbox'){
      this.deleteId = []
      this.undeleteId = []
      let _this = this
      this.currentData.map(function(item){
        if(stChange['checkbox'].map(function(item){
          return item.id}).indexOf(item.id) >= 0)
        {

        }
        else{
          _this.undeleteId.push({id:item['id']})
        }
      })
      stChange['checkbox'].map(function(item){
        _this.deleteId.push({id:item['id']})
      })
    }
    if(stChange.pi){
      if (stChange.pi != this.pageIndex || stChange.ps != this.pageSize) {
        if (stChange.type === `click` || stChange.type === `dblClick`) {
          return;
        }
        this.pageIndex = stChange.pi;
        this.pageSize = stChange.ps;
        //this.dataListItem = this.dataList.slice((this.pageIndex-1)*this.pageSize,this.pageSize*this.pageIndex)
        this.getList(this.state)
      }
    }
  }
  
  async getList(str :string){
    this.isLoading = true;
    let dbname = {}
    if(str.indexOf('select') != -1){
      this.state = "select"
      if(str == "selectClearSelected"){
        this.pageIndex = 1
        this.deleteId = []
        this.deleteIdAll = []
        this.undeleteId = []
        this.undeleteIdAll = []
        this.isSelectedAll = false
      }
      if(!this.keyWord){
        this.getList('query')
        return
      }
      var obj = {}
      obj[this.selectType] = this.keyWord
      this.selectConditions = obj
      dbname = {
        dbname:"rule_management",
        filter:[
          {
            ...obj,
          },
        ],
        page: this.pageIndex - 1,
        count: this.pageSize
      }
    }
    else{
      this.selectConditions = {}
      this.state = "query"
      dbname = {
        dbname:"rule_management",
        page: this.pageIndex - 1,
        count: this.pageSize
      }
    }
    let param = {}
    let paramGetALL = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ivr",
      };
      paramGetALL = {
        dbname: "rule_management",
        page: 0,
        count: 10000,
        tablename: "ivr",
      }
    }
    else if(this.currentIndex == 1){
      param = {
        ...dbname,
        tablename: "pkr",
      };
      paramGetALL = {
        dbname: "rule_management",
        page: 0,
        count: 10000,
        tablename: "pkr",
      }
    }
    else if(this.currentIndex == 2){
      param = {
        ...dbname,
        tablename: "polvr",
      };
      paramGetALL = {
        dbname: "rule_management",
        page: 0,
        count: 10000,
        tablename: "polvr",
      }
    }
    else if(this.currentIndex == 3){
      param = {
        ...dbname,
        tablename: "md",
      };
      paramGetALL = {
        dbname: "rule_management",
        page: 0,
        count: 10000,
        tablename: "md",
      }
    }
    else{
      param = {
        ...dbname,
        tablename: "sa",
      };
      paramGetALL = {
        dbname: "rule_management",
        page: 0,
        count: 10000,
        tablename: "sa",
      }
    }

    this.proSrv.getAllListInfoPost(UtilStatic.host+'getSingleTable', paramGetALL)
    .subscribe(data => {
      this.dataAllList = data['data']
      if(!this.isHadloaded){
          // this.allType = Object.keys(data['data'][0])
          // this.selectType = Object.keys(data['data'][0])[0]
        this.getAllSelectType()
        this.isHadloaded = true
      }
    }, error => {

    });
    var _this = this
    return new Promise((resolve,reject)=>{
      _this.pageData = []
      _this.proSrv.getAllListInfoPost(UtilStatic.host+'getSingleTable', param)
      .subscribe(data => {
        _this.isLoading = false;
        _this.dataList = data['data']
        _this.total = data['allCount'];
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
        this.getList(this.state);
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
        }],
        isSelectedAll:false
      }
    }
    else{
      if(Object.keys(this.selectConditions).length > 0){
        dbname = {
          dbname:"rule_management",
          filter: this.isSelectedAll ? this.undeleteIdAll : this.deleteIdAll,
          isSelectedAll:this.isSelectedAll,
          precondition:{ 
            ...this.selectConditions
          }
        }
      }
      else{
        dbname = {
          dbname:"rule_management",
          filter: this.isSelectedAll ? this.undeleteIdAll : this.deleteIdAll,
          isSelectedAll:this.isSelectedAll,
        }
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
      await this.getList(this.state);
      if(this.dataList.length === 0 && this.pageIndex > 1){
      this.pageIndex = this.pageIndex - 1
      this.getList(this.state);
      }
      this.isSelectedAll = false
      this.undeleteId = []
      this.undeleteIdAll = []
      this.deleteIdAll = []
      this.deleteId = []
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
      var blob = new Blob(["\uFEFF" + this.toCsv(this.dataList)], { type: 'text/xlsx;charset=utf-8;' });
      var date = new Date()
      var time = (date.getMonth()+1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes()
      var filename = "export_file_" + time + ".xlsx";
      link['download'] = filename;//这里替换为你需要的文件名
      link['href'] = URL.createObjectURL(blob);
    // }
  }
  csvAdd(data : any){
    let _this = this
    var success = 0
    var fail = 0
    var csvData = data
    data.map(function(item,itemIndex){
      let dbname = {
        dbname:"rule_management"
      }
      let param = {}
      let data:any = {}
      let tablename = ''
      for(let i =0;i<item.length;i++){
        //??????? remark=xx导入后会自动变成数字
        //xlsx 文件自身兼容性问题
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
        },
      }
      var isExist = false
      var id
      for(var j=0;j<_this.dataAllList.length;j++){
        var p = 0
        for(var i in _this.dataAllList[j]){
          if(i == "id" || i == 'remark'){
            continue
          }
          else if(_this.dataAllList[j][i] == data[i]){
            p++
          }
          else{
            
          }
        }
        if(p == Object.keys(data).length - 1){
          id = _this.dataAllList[j].id
          isExist = true
          break;
        }
      }
      //console.log(isExist,"isExist");
      if(isExist){//相同数据覆盖，不同数据则添加
        let paramR = {
          ...param,
        filter:{
          id: id
        }
        }
        _this.proSrv.editInfoPost(UtilStatic.host+'updateData', paramR)
        .subscribe(data => {
          _this.isLoading = false;
          if (!data['affectedRows']) {
            fail++
            if(itemIndex == csvData.length -1){
              _this.message.info("成功："+success+"条；"+"失败："+fail+"条")
            }
            return;
          }
          success++
          console.log(success,"_this.success")
          if(itemIndex == csvData.length -1){
            _this.message.info("成功："+success+"条；"+"失败："+fail+"条")
          }
        }, error => {
          _this.isLoading = false;
        })
      }
      else{
      _this.proSrv.addInfoPost(UtilStatic.host+'addData', param)
      .subscribe(data => {
        if (!data['affectedRows']) {
          fail++
          if(itemIndex == csvData.length -1){
            _this.message.info("成功："+success+"条；"+"失败："+fail+"条")
          }
          return
        }
        else{
          success++
          if(itemIndex == csvData.length -1){
            _this.message.info("成功："+success+"条；"+"失败："+fail+"条")
          }
        }
      }, error => {
        
      })
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
      evt.target.value="" // 清空   
      this.csvAdd(this.inputdata)
      this.getList("query")
    };
    this.isLoading = false
    reader.readAsBinaryString(target.files[0]);   
  }
  getAllSelectType(){
    switch (this.currentIndex) {
      case 0:
        this.allType = [
          {value:"编号",key:"id"},
          {value:"规则类型",key:"ruletype"},
          {value:"类则子类",key:"subtype"},
          {value:"指示",key:"indicator"},
          {value:"指示值",key:"value_f"},
          {value:"上层协议",key:"uproto"},
          {value:"备注",key:"remark"},
        ];
        break;
      case 1:
        this.allType = [
          {value:"编号",key:"id"},
          {value:"规则类型",key:"ruletype"},
          {value:"协议",key:"proto"},
          {value:"特征码",key:"key_"},
          {value:"上层协议",key:"uproto"},
          {value:"备注",key:"remark"},
        ];
        break;
      case 2:
        this.allType = [
          {value:"编号",key:"id"},
          {value:"规则类型",key:"ruletype"},
          {value:"协议",key:"proto"},
          {value:"偏移量",key:"offset_f"},
          {value:"长度",key:"length"},
          {value:"偏移值",key:"value_f"},
          {value:"上层协议",key:"uproto"},
          {value:"备注",key:"remark"},
        ];
        break;
      case 3:
        this.allType = [
          {value:"编号",key:"id"},
          {value:"规则类型",key:"ruletype"},
          {value:"类则子类",key:"subtype"},
          {value:"协议",key:"proto"},
          {value:"备注",key:"remark"},
        ];
        break;
      default:
        this.allType = [
          {value:"编号",key:"id"},
          {value:"规则类型",key:"ruletype"},
          {value:"规则内容",key:"tuples"},
          {value:"组合",key:"group_f"},
          {value:"输出文件大小",key:"size"},
          {value:"输出相对路径",key:"path"},
          {value:"备注",key:"remark"},
        ];
        break;
    }
    this.selectType = "id"
  }
  /**
   * 销毁订阅
   */
  ngOnDestroy(): void {
    this.eventContent.unsubscribe();
  }
}
