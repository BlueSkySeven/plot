export enum InterfaceStr {
    getProjectCloumn = 'api/t_project/describe',
    getProjectList = 'api/t_project',
    deleteProject = 'api/t_project/',
    getTrainObjectCloumn = 'api/t_training_model/describe',
    getTrainObject = 'api/t_training_model',
    getSampleset = 'api/t_sample',
    getTrainSet = 'api/t_train_sets',
    getAllInfo = 'api/get-all-info',
    addInfo = 'api/add-info',
    updateInfo = 'api/update-info',
    updateInfoPatch = 'api/update-info-patch',
    deleteInfo = 'api/delete-info',
    getMysqlSchema = 'schema/getmysqlschema',
    getRelation = 'api/get-relation-info',
    getProjectBulk = 'api/t_project/bulk',
    relationProjectTraining = 'api/t_project_training_bind',
    releaseRelation = 'api/t_project_training_bind',
    getSampleTrainBind = 'api/t_train_sample_bind',
    getProjectInfo = 'api/get-project-info',
    getQuantity = 'api/t_project_training_bind/count',
    getTrainingInfo = 'api/get-training-info',
    getTrainTitle = 'api/t_training_model/%/t_training_train_bind',
    getTrainingSetBind = 'api/t_training_train_bind',
    deleteRelationInfo = 'api/delete-relation-info',
    getSchemaAllInfo = 'api/get-trainset-data',
    getTrainingTarget = 'api/get-target-training-info',
    getRelationChart = 'chart/get-relation-chart',
    deleteTraining = 'api/delete-training-object',
    deleteByCondition = 'api/delete-by-condition',
    updateProjectPatch = 'api/update-project-patch',
}
