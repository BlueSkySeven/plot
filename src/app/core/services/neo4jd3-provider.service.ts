import { Injectable } from '@angular/core';
import { v1 as neo4j } from '@duoduo-oba/neo4j-driver';
import { neo4jURL } from '../../util/util-static';

@Injectable({
  providedIn: 'root'
})
export class Neo4jd3ProviderService {
  driver: neo4j.Driver;
  session: neo4j.Session;
  count = 1;
  constructor() { }

  /**
   * 连接图形数据数据库
   */
  connect(): void {
    this.driver = neo4j.driver(neo4jURL);
    this.session = this.driver.session();
  }

  /**
   * 图形数据库服务
   * @param query 查询cql
   */
  run(query: string): neo4j.Result {
    if (!this.session) {
      this.connect();
      this.count++;
    }
    return this.session.run(query);
  }

  /**
   * 销毁
   */
  disConnect(): void {
    this.session.close();
    this.driver.close();
  }
}
