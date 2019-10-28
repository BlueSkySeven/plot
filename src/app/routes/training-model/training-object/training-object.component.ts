import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { STColumn, STChange, STData } from '@delon/abc';
import { _HttpClient, SettingsService } from '@delon/theme';
import { TrainingModelProviderService, ObservableInfoProviderService } from '@core/services';
import { InterfaceStr, LoadTreeInfo } from '@core/interface';
import { UtilStatic, utilMessage } from '../../../util/util-static';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
const moment = require('moment');

@Component({
  selector: 'app-training-object',
  templateUrl: './training-object.component.html',
  styleUrls: ['./training-object.component.less'],
  styles: []
})
export class TrainingObjectComponent implements OnInit, OnDestroy {
  page = UtilStatic.page;
  pageIndex = 1;
  pageSize = 10;
  total: number;
  pageData: {};
  keyWord = ``;
  expandKeys = ['100', '1001'];
  treevalue: string;
  trainingTitle: string;
  projectComment: string;
  projectOrg: string;
  estimatedTime: Date;
  trainList: string;
  trainingFlow: string;
  copyTarget: any = {};
  trainingObj: LoadTreeInfo;
  relationObj: LoadTreeInfo;
  flowObj: LoadTreeInfo;
  flowResult: any;
  selectedProject: { id?: string, key?: string } = {};
  alreadyProjectArr: any[] = [];
  inputValue: { id?: number, name?: string } = {};
  awaitSlow: boolean;
  isLoading: boolean;
  eventContent: Subscription;
  @ViewChild("actionTplProject", { static: false }) pojectModel: TemplateRef<{}>;
  @ViewChild("actionTpl", { static: false }) trainModel: TemplateRef<{}>;
  @ViewChild("flowAction", { static: false }) flowAction: TemplateRef<{}>;
  treenodes = [];
  columns: STColumn[] = [
    { title: "方案编号", index: "training_number" },
    { title: "训练对象名称", index: "training_title" },
    { title: "训练集", index: "train_title.key" },
    { title: "分析流", index: "training_flow.key" },
    { title: "分析人", index: "training_people" },
    { title: "挖掘报告", index: "training_report" },
    { title: "日期", index: "create_time", type: `date` },
    {
      title: "操作", index: "", "buttons": [{
        text: '编辑',
        icon: 'edit',
        type: 'modal',
        click: (record, _modal, comp) => {
          this.copyTarget = record;
          this.trainingTitle = record.training_title;
          this.trainList = record.training_flow;
          this.trainingFlow = record.training_flow;
          this.setTreeInfo({ isSelect: true });
          this.add(`编辑训练对象`, this.trainModel, this.editObject);
        }
      }, {
        text: '打开解决方案',
        icon: 'to-top',
        type: 'modal',
        click: (record, _modal, comp) => {
          this.openFlow(record);
          // this.add(`解决方案`, this.flowAction, this.flowActionFun);
        }
      }, {
        text: '关联项目',
        icon: 'share-alt',
        click: (record, _modal, comp) => {
          this.relationObj = {
            loadUrl: InterfaceStr.getAllInfo,
            url: InterfaceStr.getProjectList,
            _p: 1,
            _size: 10,
            key: `project_title`,
            placeHolder: `请选择项目`
          };
          this.copyTarget = record;
          this.getRelation();
          this.add(`关联项目`, this.pojectModel, this.relationObject);
        }
      }, {
        text: '删除',
        icon: 'delete',
        popTitle: '确认删除吗？',
        pop: true,
        click: (record, _modal, comp) => {
          this.deleteObject(record.id);
          this.getTrainList();
        }
      }]
    },
  ];
  flowColumns: STColumn[] = [
    { title: "名称", index: "training_number" },
    { title: "时间", index: "training_title" },
    { title: "操作", index: "train_title.key" },
  ];
  constructor(
    private http: _HttpClient,
    private traSrv: TrainingModelProviderService,
    private message: NzMessageService,
    private modelSrv: NzModalService,
    private settingsService: SettingsService,
    private activatedRoute: ActivatedRoute,
    private events: ObservableInfoProviderService
  ) { }

  _onReuseInit() {
    const data = localStorage.getItem(`project_target`);
    const targetProject = data ? JSON.parse(data) : {};
    this.inputValue.name = targetProject.project_title;
    this.inputValue.id = targetProject.id;
    this.getTrainList();
  }

  ngOnInit() {
    const getKey = `training-model`;
    this.eventContent = this.events.currentSelectedPoint(getKey).subscribe(param => {
      const { queryParams } = param as { queryParams: any };
      this.keyWord = queryParams.label;
      this._onReuseInit();
    });
    if (this.events.obHistoryInfo[getKey]) {
      const { queryParams } = this.events.obHistoryInfo[getKey] as { queryParams: any };
      this.keyWord = queryParams.label;
      delete this.events.obHistoryInfo[getKey];
    }
    this._onReuseInit();
  }

  clearProject(): void {
    localStorage.removeItem(`project_target`);
  }

  /**
   * 获取内容
   */
  getTrainList(stChange?: STChange): void {
    if (stChange) {
      if (stChange.type === `click`) {
        return;
      }
      this.pageIndex = stChange.pi;
      this.pageSize = stChange.ps;
    }
    let targetUrl = ``; let keyObj = {};
    targetUrl = InterfaceStr.getTrainingInfo;
    if (this.inputValue.name) {
      targetUrl = InterfaceStr.getTrainingTarget;
      keyObj = {
        id: this.inputValue.id,
        keyWord: this.keyWord
      }
    }
    const param = {
      url: InterfaceStr.getTrainObject,
      trainUrl: InterfaceStr.getTrainTitle,
      ...keyObj,
      _p: this.pageIndex,
      _size: this.pageSize,
      _where: `(training_title,like,~${this.keyWord ? this.keyWord.trim() : ``}~)`
    }
    this.isLoading = true;
    this.traSrv.getAllListInfo(targetUrl, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        this.pageData = data.results.map((cur: any) => {
          try {
            cur.training_flow = JSON.parse(cur.training_flow);
            cur.training_report = `报表准确率：${cur.training_report}`;
          } catch (error) {
            cur.training_flow = {};
            console.log(error);
          }
          return cur;
        });
        this.total = data.info.total;
        if (!data.results.length && this.pageIndex > 1) {
          this.pageIndex--;
          this.getTrainList();
        }
      }, error => {
        this.isLoading = false;
      });
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
   * treeInfo
   */
  setTreeInfo({ isSelect = false }): void {
    let tempObj = {};
    if (isSelect) {
      const { train_title } = this.copyTarget || { train_title: null };
      tempObj = {
        relationArr: [train_title.key],
        isSelect
      };
    }
    this.trainingObj = {
      loadUrl: InterfaceStr.getAllInfo,
      url: InterfaceStr.getTrainSet,
      _p: 1,
      _size: 10,
      key: `train_title`,
      placeHolder: `请选择`,
      selectInfo: this.copyTarget.train_title,
      ...tempObj
    };
    this.flowObj = this.getRecordInfo({ isSelect });
  }

  /**
   * 插入
   */
  addObject = (): void => {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    if (!this.trainingTitle || !Object.keys(this.selectedProject || {}).length || !Object.keys(this.flowResult || {}).length) {
      this.message.error(utilMessage.docError);
      return;
    }
    const param = {
      url: InterfaceStr.getTrainObject,
      training_number: `code-${nowTime}`,
      training_title: this.trainingTitle,
      train_title: this.selectedProject && this.selectedProject.id || this.copyTarget.train_title,
      training_flow: JSON.stringify(this.flowResult),
      training_people: this.settingsService.user.name,
      training_report: `50%`,
      create_time: timeStr,
      update_time: timeStr
    };
    this.isLoading = true;
    this.traSrv.addInfo(InterfaceStr.addInfo, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.insertError);
          return;
        }
        this.relationTrain(data.results.insertId, this.selectedProject.id);
        if (this.inputValue.name) {
          this.relationObject(this.inputValue.id, data.results.insertId);
        }
        this.message.success(utilMessage.insertSccess);
        this.trainingTitle = ``;
        this.getTrainList();
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 编辑训练对象
   */
  editObject = (): void => {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    if (!this.trainingTitle) {
      this.message.error(utilMessage.docError);
      return;
    }
    const title = this.selectedProject && this.selectedProject.id || this.copyTarget.train_title.id;
    const param = {
      url: `${InterfaceStr.getTrainObject}/${this.copyTarget.id}`,
      editBindUrl: `${InterfaceStr.getTrainTitle}`.replace('%', this.copyTarget.id),
      training_title: this.trainingTitle,
      train_title: typeof title === `object` ? JSON.stringify(title) : title,
      training_flow: JSON.stringify(this.flowResult || this.copyTarget.training_flow),
      training_people: this.settingsService.user.name,
      training_report: `50%`,
      update_time: timeStr
    };
    this.isLoading = true;
    this.traSrv.updateInfo(InterfaceStr.updateInfoPatch, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.updateError);
          return;
        }
        this.message.success(utilMessage.updateSccess);
        this.getTrainList();
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 获取关联项目
   */
  getRelation(): void {
    const param = {
      url1: `api/t_training_model/${this.copyTarget.id}/t_project_training_bind`,
      url2: InterfaceStr.getProjectBulk,
      onlyKey: `t_project_id`,
    };
    this.isLoading = true;
    this.traSrv.getRelation(InterfaceStr.getRelation, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.relationError);
          return;
        }
        if (Object.prototype.toString.call(data.results) === `[object Array]`) {
          this.alreadyProjectArr = data.results;
          this.relationObj.relationArr = data.results.map((cur: any) => cur.project_title);
          return;
        }
        this.alreadyProjectArr = [];
        this.relationObj.relationArr = [];
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 解除关联
   */
  releaseRelation = (id: number, index: number): void => {
    const param = {
      url: `${InterfaceStr.releaseRelation}/${id}`,
      id
    };
    this.isLoading = true;
    this.traSrv.releaseRelation(InterfaceStr.deleteRelationInfo, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail` || !data.results.affectedRows) {
          this.message.error(utilMessage.relationError);
          return;
        }
        this.message.success(utilMessage.releaseSccess);
        this.selectedProject = null;
        this.alreadyProjectArr.splice(index, 1);
        this.relationObj.relationArr.splice(index, 1);
        this.getTrainList();
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * 关联项目
   */
  relationObject = (projectId?: number, modelId?: number): void => {
    if (!this.selectedProject) return;
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    const param = {
      url: InterfaceStr.relationProjectTraining,
      create_time: timeStr,
      t_project_id: projectId || this.selectedProject.id,
      t_training_model_id: modelId || this.copyTarget.id,
    };
    this.isLoading = true;
    this.traSrv.relationProject(InterfaceStr.addInfo, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.relationError);
          return;
        }
        this.message.success(utilMessage.relationSccess);
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * 关联
   */
  relationTrain = (trainId: string, tSetid: string): void => {
    const nowTime = Date.now();
    const timeStr = moment(nowTime).format(UtilStatic.timeFromat);
    const param = {
      url: InterfaceStr.getTrainingSetBind,
      t_training_model_id: trainId,
      t_train_sets_id: tSetid,
      create_time: timeStr,
    };
    this.isLoading = true;
    this.traSrv.addInfo(InterfaceStr.addInfo, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          return;
        }
      }, error => {
        this.isLoading = false;
      })
  }

  /**
   * 打开分析流
   */
  openFlow = async (targetModel: any): Promise<any> => {
    const param = {
      featureSchema: {},
      lableSchema: {},
      orginalSchema: {},
      trainingInfo: {},
      flowId: targetModel.training_flow.id,
    };
    this.awaitSlow = true;
    await new Promise(_ => { setTimeout(() => _(null), 500) });
    const flowInfo = await this.getSchemaInfo({ id: targetModel.train_title.id });
    if (!Object.keys(flowInfo).length) {
      console.log({ ...param, ...flowInfo });
      this.message.error(utilMessage.flowError);
      this.awaitSlow = false;
      return;
    }
    console.log({ ...param, ...flowInfo }, targetModel.train_title.id);
    window.open(`${UtilStatic.flowUrl}${JSON.stringify({ ...param, ...flowInfo })}`);
    this.awaitSlow = false;
  }

  /**
   * 获取分析流
   */
  getRecordInfo = ({ isSelect = false }): LoadTreeInfo => {
    let tempObj = {};
    if (isSelect && this.copyTarget.training_flow) {
      tempObj = {
        relationArr: [this.copyTarget.training_flow.key],
        isSelect
      };
    }
    const param = {
      pageIndex: this.pageIndex,
      action: `querySolutionByTSolution.rest`,
      dte: Date.now(),
      login: null,
      pageNum: 1,
      pageSize: this.pageSize,
      user: `qianchang`
    };
    return {
      url: `api/rest`,
      loadUrl: `api/rest`,
      _p: 1,
      _size: 10,
      key: `name`,
      placeHolder: `请选择`,
      selectInfo: this.copyTarget.training_flow,
      ...tempObj,
      ...param
    };
  }

  /**
   * 删除模型
   */
  deleteObject = (modelId?: number): void => {
    if (!this.selectedProject) return;
    const param = {
      url: InterfaceStr.getTrainObject,
      modelId,
    };
    this.isLoading = true;
    this.traSrv.deleteObject(InterfaceStr.deleteTraining, { param: JSON.stringify(param) })
      .subscribe(data => {
        this.isLoading = false;
        if (data.info.msg === `fail`) {
          this.message.error(utilMessage.deleteError);
          return;
        }
        this.getTrainList();
        this.message.success(utilMessage.deleteSccess);
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * 获取训练集Schema信息
   */
  getSchemaInfo(targetInfo: { id: number }): Promise<any> {
    return new Promise((res, rej) => {
      this.traSrv.addInfo(InterfaceStr.getSchemaAllInfo, { param: JSON.stringify(targetInfo) }).subscribe(data => {
        res(data.results)
      })
    })
  }

  /**
   * 禁止删除tag
   */
  preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    console.log('tag can not be closed.');
  }

  /**
   * 销毁订阅
   */
  ngOnDestroy(): void {
    this.eventContent.unsubscribe();
  }
}
