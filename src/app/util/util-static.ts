import { NzMessageService } from 'ng-zorro-antd';
import { STPage } from '@delon/abc';
// 表格数据
const UtilStatic = {
    // host: "rest/",
    host: "",
    page: {
        front: false,// 后端分页
        pageSizes: [10, 20, 50],
        showSize: true,
        total: true,
        show: true,
        showQuickJumper: true
    },
    timeFromat: `YYYY-MM-DD HH:mm:ss`,
    flowUrl: `http://192.168.11.102:6093/app/#/home/openFlow?flowId=96365c1e02dd41beb166a250ea5b87a9&transferId=QwRTa8Aw&transfer=`,
}

const neo4jURL = 'http://192.168.21.18:7474'
// 消息提示
const utilMessage = {
    deleteSccess: `删除成功~~~`,
    deleteError: `删除失败~~~`,
    insertSccess: `插入成功~~~`,
    insertError: `插入失败~~~`,
    updateSccess: `修改成功~~~`,
    updateError: `修改失败~~~`,
    getRelationError: `获取关联失败~~~`,
    releaseSccess: `解除成功~~~`,
    relationSccess: `关联成功~~~`,
    relationError: `解除失败~~~`,
    docError: `信息不完整~~~`,
    flowError: `schema信息不完整,请重新检查训练集或样本数据,创建解决方案中止~~~`,
    searchError: `节点暂无溯源信息~~~~`,
    lifeError: `数据错误，请检查是否为完整数据链~~~`,
    maxLifeMsg: `由于性能关系,最多比较分析十条数据~~~`,
    LifeMsgNull: `暂未找到该关键字图形数据~~~`,
    lifeRepeat: `比较数据不能重复~~~`,
    lifeOrder: `数据加需要按顺序添加，不能：跨数据、跨节点~~~`,
}

// 图形数据库url
const searchURL = {
    0: `MATCH (n) WHERE n.project_title =~ '.*&.*'
     OR n.data_name =~ '.*&.*' 
     OR n.train_title =~ '.*&.*' 
     OR n.training_title =~ '.*&.*' RETURN n LIMIT 25`,
    2: `MATCH (n)-[r]->(n2:%) WHERE n2.id=% RETURN n LIMIT 25`,
    1: `MATCH (n:t_sample)-[r:tSampleTotSets]->(n2:t_train_sets) where n.id=25 RETURN n,r,n2 LIMIT 25`,
    3: `MATCH (n:t_train_sets) RETURN n LIMIT 25`,
    4: `MATCH p=()-->() RETURN p LIMIT 25`,
};
const T_PROJECT = `t_project`; // 项目
const T_SAMPLE = `t_sample`; // 样本
const T_TRAIN_SETS = `t_train_sets`; // 训练集
const T_TRAINING_MODEL = `t_training_model`; // 训练模型

// 图形数据库关系
const getSearchURL = (opts: any): any | null | undefined => {
    if (!opts && opts.table) return;
    switch (opts.table) {
        case T_PROJECT:
            return `MATCH (n:${T_PROJECT})-[r:t_project_training_bind]-(n2:${T_TRAINING_MODEL}) where n.id=${opts.id} RETURN n,r,n2 LIMIT 25`;
        case T_SAMPLE:
            return `MATCH (n:${T_SAMPLE})-[r:tSampleTotSets]-(n2:${T_TRAIN_SETS}) where n.id=${opts.id} RETURN n,r,n2 LIMIT 25`;
        case T_TRAIN_SETS:
            return `MATCH (n:${T_TRAIN_SETS})-[r:${opts.bind || 't_training_train_bind'}]-(n2:${opts.toTable || T_TRAINING_MODEL}) where n.id=${opts.id} RETURN n,r,n2 LIMIT 25`;
        case T_TRAINING_MODEL:
            return `MATCH (n:${T_TRAINING_MODEL})-[r:t_project_training_bind]-(n2:${T_PROJECT}) where n.id=${opts.id} RETURN n,r,n2 LIMIT 25`;
        default:
            return;
    }
};

// 图形数据库跳转指定路由
const routerLink = {
    t_train_sets: `/data-set/training-set`,
    t_project: `/project/project-list`,
    t_sample: `/data-set/sample-set`,
    t_training_model: `/training-model/training-object`,
};

// 生命周期配色
const LifeColorArr = [`#a5dff9`, `#1890ff`, `#60c5ba`, `#feee7d`]

// 生命周期对比字段
const lifeColumns = [{ "label": "样本集名称", "value": "data_name" }, { "label": "项目组织名称", "value": "p_org" },
{ "label": "项目创建时间", "value": "p_up_time" }, { "label": "项目名称", "value": "project_title" },
{ "label": "样本格式", "value": "s_fmt" }, { "label": "样本大小", "value": "s_size" },
{ "label": "样本数据源类型", "value": "s_wh_type" }, { "label": "样本ID", "value": "sampleID" },
{ "label": "解决方案名称", "value": "tm_flow" }, { "label": "训练集名称", "value": "train_title" },
{ "label": "训练对象名称", "value": "training_title" }, { "label": "训练集特征", "value": "ts_feature" },
{ "label": "训练集Label", "value": "ts_lable" }, { "label": "训练集大小", "value": "ts_size" },
{ "label": "训练集抽样比例", "value": "ts_size_pct" }];

const defalutColumns = ["data_name", "p_org", "p_up_time", "project_title",
    "s_fmt", "s_size", "s_wh_type", "sampleID", "tm_flow", "train_title",
    "training_title", "ts_feature", "ts_lable", "ts_size", "ts_size_pct"];

export {
    UtilStatic,
    neo4jURL,
    utilMessage,
    searchURL,
    routerLink,
    getSearchURL,
    LifeColorArr,
    lifeColumns,
    defalutColumns
};

