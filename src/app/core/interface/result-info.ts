/**
 * 数据返回格式
 */
export interface ResultInfo {
    results: [] | any,
    info?: {
        msg?: string;
        total?: number;
    }
}
