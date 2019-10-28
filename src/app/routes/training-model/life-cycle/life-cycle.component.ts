import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Neo4jInfo, InterfaceStr } from '@core/interface';
import * as Neo4jd3 from '@duoduo-oba/neo4jd3';
import * as d3 from 'd3';
import { GetChartInfoProviderService, ObservableInfoProviderService } from '@core/services';
import { Status } from '@core/func/graph/Util/constant'
import Node from '@core/func/graph/Node/Node'
import Graph from '@core/func/graph/index'
import Thumbnail from '@core/func/graph/Thumbnail/index'
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { LifeColorArr, lifeColumns, utilMessage, defalutColumns } from 'src/app/util/util-static';
import { STColumn } from '@delon/abc';
import { ViewportScroller } from '@angular/common';
import G6 from '@antv/g6';
const data = require('./neo4jData.json');

@Component({
  selector: 'app-life-cycle',
  templateUrl: './life-cycle.component.html',
  styleUrls: ['./life-cycle.component.less'],
  styles: []
})
export class LifeCycleComponent implements OnInit {
  @ViewChild("mountNode", { static: true }) mountNode: ElementRef;
  @ViewChild("scroll", { static: true }) scroll: ElementRef;
  @ViewChild("graph", { static: true }) graphDOM: ElementRef;
  @ViewChild("graphcontent", { static: true }) graphContent: ElementRef;
  defalutInfo: Neo4jInfo;
  neo4jd3: Neo4jd3;
  hotTags = ['Movie', 'Books', 'Music', 'Sports'];
  selectedTags: string[] = [];
  searchStr = ``;
  userTagsKey = this.settings.user.name;
  isFullScreen = true;
  antvInfo: any;
  graph: G6;
  canvasGraph: any;
  cycleSelect = `E_project.project_title`;
  oldInfo: any;
  LifeColorArr = LifeColorArr;
  radioValue = `A`;
  stepsArr = [`项目`, `训练模型`, `训练集`, `样本`];
  current = -1;
  targetIndex: any;
  lifeAllInfo: any = {};
  comparisonInfo: Array<any> = [];
  nzSpinning = false;
  columns: STColumn[] = [
    { title: "样本集名称", index: "data_name" },
    { title: "项目组织名称", index: "p_org" },
    { title: "项目创建时间", index: "p_up_time", type: `date` },
    // { title: "项目ID", index: "projectID" },
    { title: "项目名称", index: "project_title" },
    { title: "样本格式", index: "s_fmt" },
    // { title: "样本连接信息", index: "s_link", width: `50px`, className: `magenta` },
    { title: "样本大小", index: "s_size" },
    { title: "样本数据源类型", index: "s_wh_type" },
    { title: "样本ID", index: "sampleID" },
    { title: "解决方案名称", index: "tm_flow" },
    // { title: "建模报告 ", index: "tm_report" },
    { title: "训练集名称", index: "train_title" },
    { title: "训练对象名称", index: "training_title" },
    // { title: "训练对象ID", index: "trainmodelID" },
    // { title: "训练集ID", index: "trainsetsID" },
    { title: "训练集特征", index: "ts_feature", width: `50px`, className: `magenta` },
    { title: "训练集Label", index: "ts_lable" },
    { title: "训练集大小", index: "ts_size" },
    { title: "训练集抽样比例", index: "ts_size_pct" },
  ];
  columnsHistory = [...this.columns];
  listOfOption: Array<{ label: string; value: string }> = lifeColumns;
  selectColums = defalutColumns;
  isShowTable: boolean;
  targetHash = [];
  isBreak: boolean;
  constructor(
    private router: Router,
    private message: NzMessageService,
    private settings: SettingsService,
    private getChartSrv: GetChartInfoProviderService,
    private activeRoute: ActivatedRoute,
    private position: ViewportScroller,
    private events: ObservableInfoProviderService) { }

  _onReuseInit() {
    this.reloadG6Info();
  }

  ngOnInit() {
    this.targetIndex = null;
    this.comparisonInfo = [];
    this.isFullScreen = window.location.href.includes(`fullscreen`);
    this.hotTags = JSON.parse(localStorage.getItem(this.userTagsKey) || `[]`);
    if (this.isFullScreen) {
      this.activeRoute.queryParams.subscribe(param => {
        this.searchStr = param.keyWord;
        this.cycleSelect = param.cycleSelect;
        this.reloadG6Info();
      });
      return;
    }
    this.reloadG6Info();
  }

  /**
   * 搜索
   */
  async search(): Promise<void> {
    if (this.hotTags.length > 5) {
      this.hotTags.pop();
    }
    const searchStr = this.searchStr.trim();
    this.reloadG6Info();
    if (!searchStr || this.hotTags.includes(searchStr)) {
      return;
    }
    this.hotTags.unshift(searchStr);
    localStorage.setItem(this.userTagsKey, JSON.stringify(this.hotTags));
  }

  /**
   * 热点
   * @param tag 标签
   */
  handleChange(tag: string): void {
    this.hotTags.splice(this.hotTags.indexOf(tag), 1);
    this.hotTags.unshift(tag)
    this.searchStr = tag;
    this.reloadG6Info();
    localStorage.setItem(this.userTagsKey, JSON.stringify(this.hotTags));
  }

  /**
   * 获取内容
   */
  getChartInfo(): void {
    if (!this.searchStr) {
      return;
    }
    const param = {
      keyWord: this.searchStr.trim() || ``,
      cycleSelect: this.cycleSelect,
    }
    this.isBreak = true;
    this.getChartSrv.getChartInfo(InterfaceStr.getRelationChart, { param: JSON.stringify(param) })
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(async (data) => {
        this.isBreak = false;
        let nodes = [];
        let edges = [];
        this.lifeAllInfo = data;
        if (data.results.length <= 0) {
          this.message.info(utilMessage.LifeMsgNull);
          return;
        }
        data.results.forEach(element => {
          nodes.push({
            id: element.projectID + ``,
            label: element.project_title + ``,
            color: this.LifeColorArr[0],
            projectID: element.projectID,
            target: 0,
            '项目组织名称': element.p_org,
            '项目创建时间': element.p_up_time
          });
          nodes.push({
            id: element.trainmodelID + ``,
            label: element.training_title + ``,
            color: this.LifeColorArr[1],
            trainmodelID: element.trainmodelID,
            target: 1,
            '建模报告': element.tm_report,
            '解决方案名称': element.tm_flow
          });
          nodes.push({
            id: element.trainsetsID + ``,
            label: element.train_title + ``,
            color: this.LifeColorArr[2],
            trainsetsID: element.trainsetsID,
            target: 2,
            '训练集大小': element.ts_size,
            '训练集抽样比例': element.ts_size_pct,
            '训练集特征': element.ts_feature,
            '训练集Label': element.ts_lable,
          });
          nodes.push({
            id: element.sampleID + ``,
            label: element.data_name + ``,
            color: this.LifeColorArr[3],
            sampleID: element.sampleID,
            target: 3,
            '样本格式': element.s_fmt,
            '样本大小': element.s_size,
            '样本连接信息': element.s_link,
            '样本数据源类型': element.s_wh_type,
          });
          edges.push({
            source: element.projectID + ``,
            target: element.trainmodelID + ``
          });
          edges.push({
            source: element.trainmodelID + ``,
            target: element.trainsetsID + ``
          });
          edges.push({
            source: element.trainsetsID + ``,
            target: element.sampleID + ``
          });
        });
        const hash = {};
        edges = edges.filter(cur => cur.source && cur.target);
        nodes = nodes.filter(cur => cur.id).reduce((item, next) => {
          // tslint:disable-next-line:no-unused-expression
          hash[next.id] ? null : hash[next.id] = true && item.push(next);
          return item
        }, []);
        this.oldInfo = { nodes, edges };
        this.graph.data(this.oldInfo);
        this.graph.render();
        this.graph.updateLayout({
          type: 'dagre',
          rankdir: 'LR',           // 可选，默认为图的中心
          align: 'UR',             // 可选
          nodesep: 20,             // 可选
          ranksep: 50,             // 可选
          controlPoints: true,     // 可选
          center: [window.innerWidth, 600]
        });
        this.eventAllBind();
      }, error => {
        this.isBreak = false;
        console.log(error);
      });
  }

  /**
   * G6
   */
  setG6chartInfo(): void {
    this.graph = new G6.Graph({
      container: 'mountNode',
      width: window.innerWidth,
      height: 600,
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas']
      },
      layout: {
        type: 'Random',
        nodeSize: [40, 20],
        nodesep: 1,
        ranksep: 1,
        center: [window.innerWidth, 600]
      },
      animate: true,
      defaultNode: {
        size: [80, 30],
        color: 'steelblue',
        shape: 'rect',
        style: {
          lineWidth: 2,
          fill: '#fff'
        }
      },
      defaultEdge: {
        size: 1,
        color: '#e2e2e2',
        style: {
          endArrow: {
            path: 'M 4,0 L -4,-4 L -4,4 Z',
            d: 4
          }
        }
      },
      nodeStateStyles: {
        highlight: {
          opacity: 1
        },
        dark: {
          opacity: 0.2
        }
      },
      edgeStateStyles: {
        highlight: {
          stroke: '#999'
        }
      }
    });
  }

  reloadG6Info(): void {
    if (!this.graph) {
      this.setG6chartInfo();
    }
    this.getChartInfo();
  }

  eventAllBind = (): void => {
    if (!this.graph) return;
    this.graph.on('node:mouseenter', (e) => {
      const item = e.item;
      this.graph.setAutoPaint(false);
      this.graph.getNodes().forEach((node) => {
        this.graph.clearItemStates(node);
        this.graph.setItemState(node, 'dark', true);
      });
      this.graph.setItemState(item, 'dark', false);
      this.graph.setItemState(item, 'highlight', true);
      this.graph.getEdges().forEach((edge) => {
        if (edge.getSource() === item) {
          this.graph.setItemState(edge.getTarget(), 'dark', false);
          this.graph.setItemState(edge.getTarget(), 'highlight', true);
          this.graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          this.graph.setItemState(edge.getSource(), 'dark', false);
          this.graph.setItemState(edge.getSource(), 'highlight', true);
          this.graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else {
          this.graph.setItemState(edge, 'highlight', false);
        }
      });
      this.graph.paint();
      this.graph.setAutoPaint(true);
    });
    this.graph.on('mouseenter', (e) => {
      console.log(e);

    });
    this.graph.on('node:mouseleave', this.clearAllStats);
    this.graph.on('canvas:click', this.clearAllStats);
  }

  /**
   * 清除状态
   */
  clearAllStats = (): void => {
    if (!this.graph) return;
    this.graph.setAutoPaint(false);
    this.graph.getNodes().forEach((node) => {
      this.graph.clearItemStates(node);
    });
    this.graph.getEdges().forEach((edge) => {
      this.graph.clearItemStates(edge);
    });
    this.graph.paint();
    this.graph.setAutoPaint(true);
  }

  async awaitAnimation(): Promise<void> {
    this.isBreak = !this.isBreak;
    await new Promise(res => setTimeout(_ => res(null), 800));
    this.isBreak = !this.isBreak;
  }

  /**
   * 溯源跳转
   * @param opts number
   */
  async breakTarget(opts): Promise<void> {
    await this.awaitAnimation();
    const param = { queryParams: opts };
    switch (opts.target) {
      case 0:
        this.router.navigate([`project/project-list`], param);
        this.events.setSelectedPoint(`project`, param);
        break;
      case 1:
        this.router.navigate([`training-model/training-object`], param);
        this.events.setSelectedPoint(`training-model`, param);
        break;
      case 2:
        this.router.navigate([`data-set/training-set`], param);
        break;
      case 3:
        this.router.navigate([`data-set/sample-set`], param);
        break;
    }
  }

  /**
   * 校验数据
   */
  checkInfo(opts): void {
    let copyData = {};
    const isCheck = this.lifeAllInfo.results.some(cur => {
      const isBol = cur.projectID === opts[0].id &&
        cur.trainmodelID === opts[1].id &&
        cur.trainsetsID === opts[2].id &&
        cur.sampleID === opts[3].id
      if (isBol) {
        copyData = { ...cur };
      }
      return isBol;
    });
    if (!isCheck) {
      this.message.warning(utilMessage.lifeError);
      return;
    }
    if (this.comparisonInfo.length >= 10) {
      this.message.warning(utilMessage.maxLifeMsg);
      return;
    }
    const isRepeat = this.comparisonInfo.some(cur => {
      const isBol = cur.projectID === opts[0].id &&
        cur.trainmodelID === opts[1].id &&
        cur.trainsetsID === opts[2].id &&
        cur.sampleID === opts[3].id
      if (isBol) {
        copyData = { ...cur };
      }
      return isBol;
    });
    if (isRepeat) {
      this.message.warning(utilMessage.lifeRepeat);
      return;
    }
    this.comparisonInfo.push({ ...copyData });
    this.current = -1;
    this.message.success(utilMessage.insertSccess);
  }

  /**
   * 删除标签
   * @param target 当前标签坐标
   */
  onCloseTag(target: number): void {
    this.comparisonInfo.splice(target, 1);
    this.isShowTable = this.comparisonInfo.length >= 2;
  }

  /**
   * 更新匹配字段
   */
  async setcomparColums(): Promise<void> {
    await new Promise(res => setTimeout(_ => res(_), 500));
    this.nzSpinning = true;
    this.columns = this.columnsHistory.filter((cur: any) => this.selectColums.includes(cur.index));
    this.nzSpinning = false;
    this.comparisonInfo = [...this.comparisonInfo];
  }

  /**
   * Conversion
   */
  async conversionInfo(): Promise<void> {
    this.nzSpinning = true;
    await new Promise(res => setTimeout(_ => res(_), 500));
    this.nzSpinning = false;
    await new Promise(res => setTimeout(_ => res(_), 500));
    this.position.scrollToPosition([0, this.scroll.nativeElement.scrollHeight]);
  }

  /**
   * 创建d3菜单
   * @param d3Event 事件
   */
  createConext = (d3Event: any, callBack?: (target: number, info) => void): void => {
    if (document.querySelector("#contextMenu")) {
      document.querySelector('#contextMenu').remove();
    }
    const conextMenuContainer = document.createElement('ul');
    conextMenuContainer.onmouseleave = () => {
      conextMenuContainer.style.left = '-100px';
    };
    conextMenuContainer.id = 'contextMenu';
    // 创建li
    const firstLi = document.createElement('li');
    firstLi.innerText = '添加比对';
    conextMenuContainer.appendChild(firstLi);
    const lastLi = document.createElement('li');
    lastLi.innerText = '溯源跟踪';
    conextMenuContainer.appendChild(lastLi);
    document.body.appendChild(conextMenuContainer);
    [firstLi, lastLi].forEach((cur, i) => {
      cur.onclick = () => {
        callBack(i, this.targetIndex);
      }
    })
    const menu = document.getElementById('contextMenu');
    menu.style.left = d3Event.pageX - 10 + 'px';
    menu.style.top = d3Event.pageY - 10 + 'px';
  }

  /**
   * 隐藏菜单
   */
  hideConext(): void {
    const menu = document.querySelector("#contextMenu") as HTMLElement;
    if (!menu) return;
    menu.style.left = '-100px';
  }

  /** 
   * 加载数据
   */
  loadData(target?: any) {
    setTimeout(() => this.graph.setData(target || data))
  };

  /** 
   * 点击事件
   */
  clickEvent(coordinates, evt, obj) {
    if (obj && obj instanceof Node) {
      const oldStatus = obj.status
      obj.status = oldStatus === Status.selection ? Status.default : Status.selection
      this.graph.body.emitter.emit('click.node', event, obj)
    }
  }

  /**
   * 打开全屏关系图
   */
  openFullScreen(): void {
    this.isFullScreen = window.location.href.includes(`fullscreen`);
    if (this.isFullScreen) {
      window.history.go(-1);
      return;
    }
    this.router.navigate([`training-model/life-cycle-fullscreen`], {
      queryParams: {
        keyWord: this.searchStr,
        cycleSelect: this.cycleSelect,
        // loadData: JSON.stringify(this.oldInfo),
      }
    });
  }
}
