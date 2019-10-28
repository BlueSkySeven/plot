import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { InterfaceStr, ResultInfo } from '../interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleSetProviderService {

  constructor(private http: _HttpClient) { }


  getMysqlSchema(param?): Observable<any> {
    return this.http.get(InterfaceStr.getMysqlSchema, param);
  }

  /**
   * 获取列表数据
   */
  sendReq(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }
  
  deleteBind(id, startPos) {
    // return new Promise((resolve, reject) => {
    const param = {
      startPos,
      id
    }
    return this.sendReq(InterfaceStr.deleteByCondition, { param: JSON.stringify(param) });
    // })
  }
}