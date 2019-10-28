import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { InterfaceStr } from '../interface/interface-str.enum';
import { Observable } from 'rxjs';

@Injectable()
export class GetInfoServiceService {

  constructor(private http: _HttpClient) { }

  /**
   * 获取数据列信息
   */
  getColumnService(param): Observable<any> {
    return this.http.get(InterfaceStr.getProjectCloumn, param);
  }
}
