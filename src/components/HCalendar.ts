import moment from 'moment';
import HCalendarConst from './HCalendarConst';
import HCalendarDay from './HCalendarDay';
import HCalendarWeek from './HCalendarWeek';

/**
 * 달력의 한 페이지를 표현한다.  특정 날짜를 주면, 해당 월의 달력 페이지를 구성한다.
 * 첫 주에는 해당 달의 1일 이전의 전달의 잔여 날짜가 포한되며 ,
 * 마자막 주의 해당 달 마지막 날짜 이후에도 다음 달의 첫주 날짜가 포함된다. (DATE_KIND_NO_MONTH=8)
 *
 * 특정 달에 따라 화면 표시되는 주의 숫자, 날의 숫자가 변할 수 있다.
 * 내부적으로 바닐라 자바스립트의 Date 와, moment.js 를 적절히 섞어서 사용했다.
 * 특히나, 두 날짜 간의 거리를 구하는 부분에서는 moment.js 를 사용했다.
 * <pre>
 * 2019/3월 달력
 *
 * start
 * 2/24 2/25 2/26 2/27 2/28 3/1  3/2
 * 3/3  3/4  3/5  3/6  3/7  3/7  3/9
 * 3/10 3/11 3/12 3/13 3/14 3/15 3/16
 * 3/17 3/18 3/19 3/20 3/21 3/22 3/23
 * 3/24 3/25 3/26 3/27 3/28 3/29 3/30
 * 3/31 4/1  4/2  4/3  4/4  4/5  4/6
 *                               end
 * </pre>
 * @author todaybike
 */
class HCalendarPage {

  /** 현재의 날짜를 담고 있다. next(), prev() 함수 호출 후에는 매월 1일로 세팅된다.   */
  private _today: HCalendarDay  = new HCalendarDay();
  /** 화면 상에 표시되는 첫번째 날을 담고 있다.       */
  private _start: HCalendarDay  = new HCalendarDay();
  /** 화면 상에 표시되는 마지막 날을 담고 있다.       */
  private _end: HCalendarDay    = new HCalendarDay();

  /** 표시되는 달의 주 수. 4,5,6 중에 하나가 될 것이다.   */
  private _countWeek: number    = 5;
  /** 표시되는 달에 날 수, 25, 35, 42 중에 하나가 된다.   */
  private _countDay: number    = 42;
  /** 표시되는 달에 포함된 모든 날짜를 담고 있다. HDay Array   */
  private _days: HCalendarDay[] = [];
  /** 주 단위 정보를 갖고 있는 배옇 */
  private _weeks: HCalendarWeek[] = [];

  constructor()                  { this.now();  }

  get today()                    { return this._today;      }
  set today(arg: HCalendarDay)  { this._today = arg;      }

  get year()                    { return this._today.year;  }
  set year(arg: number)          { this._today.year = arg;    }

  get month()                    { return this._today.month;  }
  set month(arg: number)        { this._today.month = arg;  }

  get date()                    { return this._today.date;  }
  set date(arg: number)          { this._today.date = arg;    }

  get start()                    { return this._start;    }
  set start(arg: HCalendarDay)  { this._start = arg;    }

  get end()                      { return this._end;      }
  set end(arg: HCalendarDay)    { this._end = arg;      }

  get weeks()                      { return this._weeks;    }
  set weeks(arg: HCalendarWeek[])  { this._weeks = arg; }

  get countWeek()  { return this._countWeek;  }
  get countDay()  { return this._countDay;  }
  get days()      { return this._days;      }


  /**
   * 현재 시간으로  달력 페이지를 설정한다.
   */
  public now() {
    const current      = new Date();
    this._today.set( current );
    this._today.setKind(current.getMonth());

    this.init( this._today.year, this._today.month );
  }

  /**
   * 다음 달로 내부 데이터를 업데이트한다.
   * 날짜는 다음 달 1일로 지정한다.
   */
  public next() {
    const nextDate = new Date( this._today.year, this._today.month + 1, 1 );
    this._today.set( nextDate );
    this.init( nextDate.getFullYear(), nextDate.getMonth() );
  }

  /**
   * 이전 달로 내부 데이터를 업데이트한다.
   * 날짜는 이전 달 1일로 지정한다.
   */
  public prev() {
    const prevDate = new Date( this._today.year, this._today.month - 1, 1 );
    this._today.set( prevDate );
    this.init( prevDate.getFullYear(), prevDate.getMonth() );
  }

  /**
   * 주어진 년/월 로 날짜 배열에 저장한다.
   * 날짜는 주어지지 않으면 1일로 지정한다.
   * @param y
   * @param m
   * @param d=1, 값이 주어지지 않으면 1로 세팅된다.
   */
  public init( y: number, m: number, d: number = 1 ): number {

    // 매우 간단한한 체크, 이 부분은 강호할 필요가 있다.
    if ( y < 1970 )  { return 0; }
    if ( m < 0 )    { return 0; }
    if ( m >= HCalendarConst.MAX_MONTH )  { return 0; }

    this._today.year  = y;
    this._today.month  = m;
    this._today.date  = d;

    const firstDate    = new Date(y, m, 1);    // 해당 월의 첫번째 날을 구한다.
    const lastDate    = new Date(y, m + 1, 0);    // 해당 월의 마지막 날을 구한다.

    const firstDayOfWeek  = firstDate.getDay();    // 첫번째 날의 주중 인덱스를 구한다.
    const lastDayOfWeek  = lastDate.getDay();    // 마지막 날의 인덱스를 구한다.

    // 첫째 날이 속한 주간의 첫번째 날을 구한다.
    // 달력 페이지에 보이는 첫번째 날이다. 해당 월의 첫번째와는 구분되어야 한다.
    const viewFirstDate  = new Date( y, m, -(firstDayOfWeek - 1) );
    this._start      = (new HCalendarDay()).set( viewFirstDate );
    this._start.setKind( this._today.month );

    // 마지막 날이 속한 주간의 마지막 날을 구한다.
    // 해당 페이지의 마지막 날짜를 구하게 된다.
    // 클래스 설명에서 보는 것처럼, 달력의 페이지에 표시되는 가장 마자믹 날짜다.
    const viewLastDate  = new Date( y, m + 1, (6 - lastDayOfWeek) );
    this._end      = (new HCalendarDay()).set( viewLastDate );
    this._end.setKind( this._today.month );

    // moment 로 변환하는 것은 두 날짜 사이의 거리를 구하기 위해서다.
    // 거리(날짜 수) 를 구하여, 날짜 배열에 날짜를 생성하여 지정한다.
    const first      = moment(viewFirstDate);
    const last      = moment(viewLastDate);
    this._countDay    = last.diff(first, 'days') + 1;      // 첫날-마지막 날의 차이, 달력에 표시되는 일자 갯수
    this._countWeek    = this._countDay / HCalendarConst.MAX_DAYOFWEEK;  // 달력에 표시되는 주 갯수

    //
    // 일자 배열에 모든 날짜를 생성하여 넣어 둔다.
    // 현재의 달과 비교하여, DATE_KIND 값도 설정한다. 이번 달의 날짜가 아니면 NO_MONTH (8) 로 설정된다.
    // 아래 for 문에서 cur 값을 리셋하는 것은 moment.js 함수의 특성인데,
    // add() 함수를 수행하고 나면, cur 의 값이 변경되어 간격을 계산하기 어렵다. for() 문을 사용했기 때문이다.
    // while() 문을 사용하여 1씩 더면하면 문제가 해결될 것 같기도 한데 ...
    // 서버 통신 후 일자별 이벤트를 등록하기 위해 배열을 초기화 해둔다.
    let cur = moment(viewFirstDate);
    for ( let i = 0; i < this._countDay; i++ ) {
      const iday = cur.add( i, 'days' );    // 현재

      const today = new HCalendarDay();
      today.year = iday.year();
      today.month = iday.month();
      today.date = iday.date();
      today.name = '';
      today.setKindWithMonth( cur.year(), cur.month(), cur.date(), this._today.month );
      today.sum = 0;
      today.count = 0;

      this._days[i] = today;

      // add() 를 수행하면, 값이 바뀌는 문제를 해결하기 위해 ...
      cur = moment(viewFirstDate);

      // while 문으로 해봐 ?, 이것도 안 이뻐 ...
      // let iday = cur.add(1,'days');
    }

    //
    // _weeks 주 단위 배열을 정리한다.
    //

    // 배열 하나를 새로 만든다.
    this._weeks = [];
    // 모든 날짜를 뽑아서 ...
    let jday = 0;

    // 주 단위로 돌면서, HCalendarDay 를 배열에 넣어 준다.
    for ( let j = 0; j < this._countWeek; j++ ) {

      // 한 주를 만들어서 ...
      const week = new HCalendarWeek();
      for ( let k = 0; k < HCalendarConst.MAX_DAYOFWEEK; k++ ) {
        week.days[k] = this._days[jday];
        jday ++;
      }
      week.count = HCalendarConst.MAX_DAYOFWEEK;

      // _weeks 배열에 넣어 준다.
      this._weeks.push( week );
    }

    return this._countDay;
  }

  /**
   * 년/월/일 에 해당하는 금액과 건수를 채운다.
   * @param y 년
   * @param m 월
   * @param d 일
   * @param sum 금액
   * @param count 건수
   */
  public setDate( y: number, m: number, d: number, sum: number, count: number ): number {
    // console.log( `HCalendar.setDate(1): ${y}, ${m}, ${d}, ${sum}, ${count}`);

    if ( sum < 0 ) { return -1; }
    if ( count < 0 ) { return -1; }

    for ( let i = 0; i < this._countDay; i++ ) {
      if ( this._days[i].equalDate(y, m, d) ) {
        this._days[i].sum = sum;
        this._days[i].count = count;

        // console.log( `HCalendar.setDate(2): ${this._days[i]}`);
      }
    }

    return d;
  }

  /**
   * day 날짜에 해당하는 금액과 건수를 채운다.
   * @param day 날짜
   * @param sum 금액
   * @param count 건수
   */
  public setDay( day: HCalendarDay, sum: number, count: number ): number {
    if ( sum < 0 ) { return -1; }
    if ( count < 0 ) { return -1; }

    for ( let i = 0; i < this._countDay; i++ ) {
      if ( this._days[i].equalDay(day) ) {
        this._days[i].sum = sum;
        this._days[i].count = count;
      }
    }

    return day.date;
  }

  /**
   * i번쩨에 해당하는 날짜를 리턴한다.
   * @param i i번째
   */
  public getDay(i: number): HCalendarDay | null {
    if ( i < 0 ) { return null; }
    if ( i > this._countDay ) { return null; }

    return this._days[i];
  }

  /**
   * i번째에 해당하는 주를 리턴한다. 주에는 날짜 정보가 배열로 포함되어 있다.
   * @param i i번째
   */
  public getWeek(i: number): HCalendarWeek | null {
    if ( i < 0 ) { return null; }
    if ( i > this._countWeek ) { return null; }

    return this._weeks[i];
  }

  /** 문자열로 바꿔 줍니다.  */
  public toString(): string {
    return ''
    + `today=(${this.today}), `
    + `start=${this.start}, `
    + `end=${this.end}, `
    + `countDay: ${this._countDay},`
    + `countWeek : ${this._countWeek},`
    /* + `weeks: ${this._weeks}` */
    ;

  }

}

class HCalendar {
  private page = new HCalendarPage();
}

export default HCalendarPage;
export { HCalendarPage };
