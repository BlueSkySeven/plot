import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { InterfaceStr, ResultInfo } from '../interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectProviderService {

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
  getAllListInfoPost(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.post(portStr, param);
  }
  /**
   * 添加列表数据
   */
  addInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

  /**
   * 修改列表数据
   */
  editInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }
  /**
   * 添加列表数据
   */
  addInfoPost(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.post(portStr, param);
  }

  /**
   * 修改列表数据
   */
  editInfoPost(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.post(portStr, param);
  }
    /**
   * 删除
   */
  deleteInfoPost(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.post(portStr, param);
  }

  /**
   * 删除
   */
  deleteInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

}
