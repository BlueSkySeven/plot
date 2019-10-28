import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { STColumn, STPage, STChange } from '@delon/abc';
import { _HttpClient, SettingsService, MenuService } from '@delon/theme';
import { GetInfoServiceService, ProjectProviderService, ObservableInfoProviderService } from '@core/services';
import { InterfaceStr } from '@core/interface';
import { UtilStatic, utilMessage } from '../../util/util-static';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
const moment = require('moment');

@Component({
  selector: 'app-system-manager',
  templateUrl: './system-manager.component.html',
  styleUrls: ['./system-manager.component.less'],
  styles: []
})
export class SystemManagerComponent implements OnInit, OnDestroy {
  id: string;
  ipv4beg: string;
  ipv4end: string;
  ip_begins: string;
  ip_ends: string;
  cname: string;
  city: string;
  longitude: string;
  latitude: string;
  zipcode: string;
  timezone: string;
  timestamp: string;
  ciso: string;
  province: string;
  origin_id: string;
  oui: string;
  supplier: string;
  currentIndex: 0;
  dataList: {};


  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: 4000000;
  pageData: {};
  keyWord = ``;
  expandKeys = ['100', '1001'];
  treevalue: string;
  projectTitle: string;
  projectComment: string;
  projectOrg: string;
  estimatedTime: Date;
  projectRecord: any;
  treenodes = [];
  isLoading: boolean;
  eventContent: Subscription;
  @ViewChild("actionTpl", { static: false }) actionTpl: TemplateRef<{}>;
  @ViewChild("actionTpl2", { static: false }) actionTpl2: TemplateRef<{}>;
  columns: STColumn[];
  columns1: STColumn[] = [
    { title: "编号", index: "id" },
    { title: "ipv4beg", index: "ipv4beg" },
    { title: "ipv4end", index: "ipv4end" },
    { title: "ip_begins", index: "ip_begins" },
    { title: "ip_ends", index: "ip_ends" },
    { title: "cname", index: "cname" },
    { title: "city", index: "city" },
    { title: "longitude", index: "longitude" },
    { title: "latitude", index: "latitude" },
    { title: "zipcode", index: "zipcode" },
    { title: "timezone", index: "timezone" },
    { title: "timestamp", index: "timestamp" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.id = record.id;
          this.ipv4beg = record.ipv4beg;
          this.ipv4end = record.ipv4end;
          this.ip_begins = record.ip_begins;
          this.ip_ends = record.ip_ends;
          this.cname = record.cname;
          this.city = record.city;
          this.longitude = record.longitude;
          this.latitude = record.latitude;
          this.zipcode = record.zipcode;
          this.timezone= record.timezone;
          this.timestamp = record.timestamp;
          this.ciso = record.ciso;
          this.province = record.province;

          this.add('编辑', 0, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.id = record.id
          this.deleteObject();
          this.getList('query');
        }
      }]
    },
  ];
  columns2: STColumn[] = [
    { title: "编号", index: "id" },
    { title: "oui", index: "oui" },
    { title: "supplier", index: "supplier" },
    { title: "timestamp", index: "timestamp" },
    {
      title: "操作", index: "", "buttons": [
      {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.id = record.id
          this.origin_id = record.origin_id;
          this.oui = record.oui;
          this.supplier = record.supplier;
          this.add('编辑', 1, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.id = record.id
          this.deleteObject();
          this.getList('query');
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
    this.getList('query');
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
    this.columns = this.columns1
    this.currentIndex = 0
    this.total = 4000000
    this.getList('query');
    
  }

  /**
   * 获取内容
   */
  async changeTab(stChange){
    this.isLoading = true;
    this.currentIndex = stChange
    this.pageIndex = 1
    if(stChange == 0){
      this.columns = this.columns1
    }
    else{
      this.columns = this.columns2
    }
    await this.getList('query')
    this.isLoading = false;
    console.log(this.pageData)
  }
  changePageData(stChange?: STChange){
    //this.deteleId = stChange
    console.log(stChange)
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
  getTotal(){
    let tableName = ""
    if(this.currentIndex == 0){
      tableName = "ip"
    }
    else{
      tableName = "mac"
    }
    this.proSrv.getAllListInfoPost('http://192.168.21.6:3001/getSingleTable', {
      dbname:"knowledge_management",
      tablename: tableName,
    })
    .subscribe(data => {
      this.total = data['allCount']
    }, error => {
    });
  }
  getList(str : string){
    let dbname = {}
    if(str == 'select'){
      if(!this.keyWord){
        return
      }
      dbname = {
        dbname:"knowledge_management",
        filter:[{
          id:this.keyWord,
        }],
      }
    }
    else{
      dbname = {
        dbname:"knowledge_management",
        page: this.pageIndex - 1,
        count: this.pageSize
      }
      console.log
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ip",
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "mac",
      };
    }
    this.isLoading = true;
    var _this = this
    return new Promise(function(){
      _this.pageData = []
      _this.proSrv.getAllListInfoPost('http://192.168.21.6:3001/getSingleTable', param)
      .subscribe(data => {
        _this.isLoading = false;
        _this.dataList = data
        _this.total = str == 'select' ? data['data'].length : data['allCount'];
        _this.pageData = data['data'] || []
        // _this.getTotal()
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
      this.ipv4beg = null;
      this.ipv4end = null;
      this.ip_begins = null;
      this.ip_ends = null;
      this.cname = null;
      this.city = null;
      this.longitude = null;
      this.latitude = null;
      this.zipcode = null;
      this.timezone= null;
      this.timestamp = null;
      this.ciso = null;
      this.province = null;
      this.origin_id = null,
      this.oui = null,
      this.supplier = null
    }
    var tpl2: TemplateRef<{}>
    if(tpl == 0){
      tpl2 = this.actionTpl
    }
    else{
      tpl2 = this.actionTpl2
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
      dbname:"knowledge_management"
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ip",
        data:{
          ipv4beg : this.ipv4beg,
          ipv4end : this.ipv4end,
          ip_begins : this.ip_begins,
          ip_ends : this.ip_ends,
          cname : this.cname,
          city : this.city,
          longitude : this.longitude,
          latitude : this.latitude,
          zipcode : this.zipcode,
          timezone : this.timezone,
          timestamp : this.timestamp,
          ciso : this.ciso,
          province : this.province,
        }
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "mac",
        data:{
          origin_id : this.origin_id,
          oui : this.oui,
          supplier : this.supplier,
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
        this.getList('query');
        this.ipv4beg = null;
        this.ipv4end = null;
        this.ip_begins = null;
        this.ip_ends = null;
        this.cname = null;
        this.city = null;
        this.longitude = null;
        this.latitude = null;
        this.zipcode = null;
        this.timezone= null;
        this.timestamp = null;
        this.ciso = null;
        this.province = null;
        this.origin_id = null,
        this.oui = null,
        this.supplier = null
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 编辑
   */
  editObject = (): void => {
    let dbname = {
      dbname:"knowledge_management",
      filter:{
        id: this.id
      }
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ip",
        data:{
          ipv4beg : this.ipv4beg,
          ipv4end : this.ipv4end,
          ip_begins : this.ip_begins,
          ip_ends : this.ip_ends,
          cname : this.cname,
          city : this.city,
          longitude : this.longitude,
          latitude : this.latitude,
          zipcode : this.zipcode,
          timezone : this.timezone,
          timestamp : this.timestamp,
          ciso : this.ciso,
          province : this.province,
        }
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "mac",
        data:{
          origin_id : this.origin_id,
          oui : this.oui,
          supplier : this.supplier,
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
        this.getList('query');
      }, error => {
        this.isLoading = false;
      })
      this.ipv4beg = null;
      this.ipv4end = null;
      this.ip_begins = null;
      this.ip_ends = null;
      this.cname = null;
      this.city = null;
      this.longitude = null;
      this.latitude = null;
      this.zipcode = null;
      this.timezone= null;
      this.timestamp = null;
      this.ciso = null;
      this.province = null;
      this.origin_id = null,
      this.oui = null,
      this.supplier = null
  }

  /**
   * 删除
   */
  deleteObject = (): void => {
    let dbname = {
      dbname:"knowledge_management",
      filter:{
        id: this.id
      }
    }
    let param = {}
    if(this.currentIndex == 0){
      param = {
        ...dbname,
        tablename: "ip",
      };
    }
    else{
      param = {
        ...dbname,
        tablename: "mac",
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
      this.getList('query');
    }, error => {
      this.isLoading = false;
    })
  }

  /**
   * 销毁订阅
   */
  ngOnDestroy(): void {
    console.log(123123);

    this.eventContent.unsubscribe();
  }
}