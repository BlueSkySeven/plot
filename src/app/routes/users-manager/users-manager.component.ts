import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { STColumn, STPage, STChange } from '@delon/abc';
import { _HttpClient, SettingsService, MenuService } from '@delon/theme';
import { GetInfoServiceService, ProjectProviderService, ObservableInfoProviderService } from '@core/services';
import { InterfaceStr } from '@core/interface';
import { UtilStatic, utilMessage } from '../../util/util-static';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
const moment = require('moment');

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.less'],
  styles: []
})
export class UsersManagerComponent implements OnInit, OnDestroy {
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
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
  columns: STColumn[] = [
    { title: "编号", index: "project_number" },
    { title: "项目名称", index: "project_title" },
    { title: "项目摘要", index: "project_comment", width: `200px`, className: `magenta` },
    { title: "训练对象数量", index: "project_quantity" },
    // { title: "所属组织", index: "project_org" },
    { title: "项目负责人", index: "project_principal" },
    { title: "创建时间", index: "create_time", type: `date` },
    { title: "修改时间", index: "update_time", type: `date` },
    {
      title: "操作", index: "", "buttons": [{
        text: '查看训练对象',
        icon: 'search',
        type: 'modal',
        click: (record, _modal, comp) => {
          localStorage.setItem(`project_target`, JSON.stringify(record));
          this.router.navigate(['training-model/training-object'], { queryParams: { abc: 123, 123: 44 } });
        }
      }, {
        text: '编辑',
        icon: 'edit',
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.projectTitle = record.project_title;
          this.projectComment = record.project_comment;
          this.estimatedTime = record.estimated_time;
          this.add('编辑', this.actionTpl, this.editObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.projectRecord = record;
          this.deleteObject();
          this.getProjectList();
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
    this.getProjectList();
  }

  ngOnInit() {
    const getKey = `project`;
    this.eventContent = this.events.currentSelectedPoint(getKey).subscribe(param => {
      const { queryParams } = param as { queryParams: any };
      this.keyWord = queryParams.label;
      delete this.events.obHistoryInfo[getKey];
      this.getProjectList();
    });
    if (this.events.obHistoryInfo[getKey]) {
      const { queryParams } = this.events.obHistoryInfo[getKey] as { queryParams: any };
      this.keyWord = queryParams.label;
      delete this.events.obHistoryInfo[getKey];
    }
    this.getProjectList();
  }

  /**
   * 获取内容
   */
  getProjectList(stChange?: STChange): void {
    this.pageData = [];
    this.total = 0;
    // if (stChange) {
    //   if (stChange.type === `click`) {
    //     return;
    //   }
    //   this.pageIndex = stChange.pi;
    //   this.pageSize = stChange.ps;
    // }
    // this.isLoading = true;
    // const param = {
    //   url: InterfaceStr.getProjectList,
    //   trainUrl: `${InterfaceStr.getQuantity}?_where=(t_project_id,eq,%)`,
    //   _p: this.pageIndex,
    //   _size: this.pageSize,
    //   _where: `(project_title,like,~${this.keyWord ? this.keyWord.trim() : ``}~)`
    // }
    // this.proSrv.getAllListInfo(InterfaceStr.getProjectInfo, { param: JSON.stringify(param) })
    //   .subscribe(data => {
    //     this.isLoading = false;
    //     this.pageData = data.results;
    //     this.total = data.info.total;
    //     if (!data.results.length && this.pageIndex > 1) {
    //       this.pageIndex--;
    //       this.getProjectList();
    //     }
    //   }, error => {
    //     this.isLoading = false;
    //   });
  }

  /**
   * 新建项目弹窗
   */
  add(nzTitle: string, tpl: TemplateRef<{}>, callBack: any): void {
    this.modelSrv.create({
      nzTitle,
      nzContent: tpl,
      nzOnOk: () => {
        callBack();
      }
    })
  }

  /**
   * 插入
   */
  addObject = (): void => {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    const param = {
      url: InterfaceStr.getProjectList,
      project_number: `pj-${nowTime}`,
      project_title: this.projectTitle,
      project_comment: this.projectComment,
      project_org: this.projectOrg,
      project_principal: this.settingsService.user.name,
      create_time: timeStr,
      update_time: timeStr,
      estimated_time: moment(this.estimatedTime).format(UtilStatic.timeFromat),
      users_id: 1
    };
    this.isLoading = true;
    this.proSrv.addInfo(InterfaceStr.addInfo, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.insertError);
          return;
        }
        this.message.success(utilMessage.insertSccess);
        this.projectTitle = null;
        this.projectComment = null;
        this.estimatedTime = null;
        this.getProjectList();
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 编辑
   */
  editObject = (): void => {
    let param = {
      url: `${InterfaceStr.getProjectList}/${this.projectRecord.id}`,
      project_title: this.projectTitle,
      project_comment: this.projectComment,
      estimated_time: moment(this.estimatedTime).format(UtilStatic.timeFromat)
    };
    delete this.projectRecord._values;
    this.projectRecord.create_time = moment(this.projectRecord.create_time).format(UtilStatic.timeFromat);
    this.projectRecord.update_time = moment(this.projectRecord.update_time).format(UtilStatic.timeFromat);
    this.projectRecord.estimated_time = moment(this.projectRecord.estimated_time).format(UtilStatic.timeFromat);
    param = { ...this.projectRecord, ...param };
    this.isLoading = true;
    this.proSrv.editInfo(InterfaceStr.updateProjectPatch, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.updateError);
          return;
        }
        this.message.success(utilMessage.updateSccess);
        this.projectTitle = null;
        this.projectComment = null;
        this.estimatedTime = null;
        this.getProjectList();
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 删除
   */
  deleteObject = (): void => {
    const param = {
      url: InterfaceStr.getProjectList,
      id: this.projectRecord.id,
    };
    this.isLoading = true;
    this.proSrv.deleteInfo(InterfaceStr.deleteInfo, { param: JSON.stringify(param) }).subscribe(data => {
      this.isLoading = false;
      if (data.info.msg === `fail`) {
        this.message.error(`请先检查当前项目是否关联训练对象,请先解除,${utilMessage.deleteError}`);
        return;
      }
      this.message.success(utilMessage.deleteSccess);
      this.getProjectList();
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
