import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { LoadTreeInfo } from '@core/interface';

@Component({
  selector: 'app-load-flow-select',
  templateUrl: './load-flow-select.component.html',
  styles: []
})
export class LoadFlowSelectComponent implements OnInit {
  optionList: {}[] = [];
  @Output() selected: EventEmitter<{}> = new EventEmitter<{}>();
  selectedValue = null;
  isLoading = false;
  searchChange$ = new BehaviorSubject('');
  optionList$: Observable<string[]>
  fristBool = true;
  @Input() selectOption: LoadTreeInfo;
  getRandomNameList: (name: string) => Observable<string[]>;
  constructor(private http: _HttpClient) {
  }

  ngOnInit() {
    if (this.selectOption.selectInfo) {
      this.optionList = [this.selectOption.selectInfo];
    }
    this.loadMore();
  }

  /**
   * 搜
   * @param value value
   */
  onSearch(value: string): void {
    if (!this.optionList$) {
      this.search();
    }
    this.isLoading = true;
    this.searchChange$.next(value);
  }

  /**
   * 触底加载
   */
  loadMore = (): void => {
    this.getRandomNameList = (name: string) => {
      if (name.trim()) {
        this.selectOption._p = 0;
      }
      this.selectOption.pageNum = this.selectOption._p;
      return this.http
        .get(this.selectOption.loadUrl,
          {
            param: JSON.stringify({
              ...this.selectOption,
              _where: `(${this.selectOption.key},like,~${name.trim()}~)`
            })
          }
        )
        .pipe(map((res: any) => res!.data!.list!.recordList))
        .pipe(
          map((list: any) => {
            return list.map((item: any) => ({
              id: item.id,
              key: item[this.selectOption.key]
            }
            ));
          })
        );
    };
    this.getRandomNameList(``).subscribe(data => {
      this.isLoading = false;
      const hash = {};
      this.optionList = [...this.optionList, ...data];
      this.optionList = this.optionList.reduce((item: any, next: any) => {
        // tslint:disable-next-line:no-unused-expression
        hash[next.id] ? null : hash[next.id] = true && item.push(next);
        return item
      }, []);
      if (this.selectOption.isSelect && this.fristBool) {
        const key = this.selectOption.relationArr[0];
        const target = this.optionList.find((cur: { id: number, key: string }) => cur.key === key) as any;
        if (!target) return;
        this.selectedValue = target.id;
      }
    });
    this.selectOption._p++;
  }

  /**
   * 搜索
   */
  search(): void {
    this.isLoading = true;
    this.optionList$ = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(this.getRandomNameList));
    this.optionList$.subscribe((data: string[]) => {
      this.optionList = data;
      this.isLoading = false;
    });
  }
  /**
   * 发送数据
   */
  ngModelChange(id: number): void {
    const isNumber = typeof id === `number`;
    this.selected.emit(isNumber ? this.optionList.find((cur: { id: number, key: string }) => cur.id === id) : null);
  }

  /**
   * 禁用
   */
  disabledOption(lable: string): boolean {
    if (!this.selectOption.relationArr) return false;
    return this.selectOption.relationArr.includes(lable);
  }
}
