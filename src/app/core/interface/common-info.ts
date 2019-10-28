/**
 * tree远程数据访问格式
 */
export interface LoadTreeInfo {
    loadUrl: string,
    key: string,
    placeHolder: string,
    url: string,
    _p: number,
    _size: number
    relationArr?: string[],
    isSelect?: boolean,
    selectId?: number,
    selectInfo?: {}
    pageNum?: number
}

/**
 * 用户数据
 */
export interface UserInfo {
    email: string,
    id: number,
    avatar: string,
    name: string,
    time: number,
    token: string,
}


/**
 * 生命周期数据nodes
 */
export interface Nodes {
    nodes: Array<NodesChildId>,
    edges: Array<NodesChildTarget>
}

export interface NodesChildId {
    id: string,
    x?: number,
    y?: number,
}

export interface NodesChildTarget {
    source: string,
    target: string,
    startPoint?: string,
    endPoint?: string,
    controlPoints?: string,
}

/**
 * neo4j数据
 */
export interface Neo4jInfo {
    results: [
        {
            columns?: [],
            data?: [
                {
                    graph?: {
                        nodes?: [],
                        relationships?: []
                    }
                }
            ]
        }
    ],
    errors?: [],
    records?: [
    ]
}