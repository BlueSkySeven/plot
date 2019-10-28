import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableInfoProviderService {

  private obMap = {};
  public obHistoryInfo = {};
  constructor() {
  }

  public setSelectedPoint(eventName: string, selectedPointsIfo: any): void {
    this.isEvent(eventName, selectedPointsIfo);
    this.obMap[eventName].next(selectedPointsIfo);
    this.obHistoryInfo[eventName] = selectedPointsIfo;
  }

  public currentSelectedPoint(eventName: string): Observable<any> {
    this.isEvent(eventName);
    return this.obMap[eventName].asObservable();
  }

  private isEvent(eventName: string, info?: any): void {
    if (!this.obMap[eventName]) {
      this.obMap[eventName] = new Subject<any>();
    } else if (!this.obHistoryInfo[eventName]) {
      this.obHistoryInfo[eventName] = null;
    }
  }

}
