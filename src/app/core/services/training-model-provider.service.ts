import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { InterfaceStr, ResultInfo } from '../interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingModelProviderService {

  constructor(private http: _HttpClient) { }

  /**
   * 获取列表数据
   */
  getAllListInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 获取列表数据
   */
  addInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 修改数据
   */
  updateInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 获取关联
   */
  getRelation(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 关联
   */
  relationProject(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 解除关联
   */
  releaseRelation(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 删除
   */
  deleteObject(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }
}
