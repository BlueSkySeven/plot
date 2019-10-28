import { Injectable } from '@angular/core';
import { Neo4jd3ProviderService } from './neo4jd3-provider.service';

@Injectable({
  providedIn: 'root'
})
export class GetNeo4jInfoProviderService {

  constructor(private neo4jSrv: Neo4jd3ProviderService) { }

  /**
   * 查询图形数据
   * @param opts 查询对象
   */
  getNeo4jInfo(opts: { query: string }): Promise<any> {
    return new Promise((res) => {
      this.neo4jSrv.run(opts.query)
        .then((result) => {
          res(result)
        })
    });
  }
}
