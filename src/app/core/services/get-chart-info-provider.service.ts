import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResultInfo } from '@core/interface';

@Injectable({
  providedIn: 'root'
})
export class GetChartInfoProviderService {

  constructor(private http: _HttpClient) { }
  /**
   * 获取列表数据
   */
  getChartInfo(portStr: string, param = {}): Observable<ResultInfo> {
    return this.http.get(portStr, param);
  }

}
