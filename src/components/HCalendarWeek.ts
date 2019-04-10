import moment from 'moment';
import HCalendarConst from './HCalendarConst';
import HCalendarDay from './HCalendarDay';

/**
 * 일주일을 표현하는 클래스
 * 필요한 날짜를 지정하면, 날짜가 속한 일주일을 가져 온다.
 * 날짜는 배열로 갖고 있으며, 날짜에는 구분 코도가 세팅된다.
 */
class HCalendarWeek {
  /**
   *  오늘 날짜, 정확하게는 그냥 날짜
   */
  private _today: HCalendarDay      = new HCalendarDay();

  /** 일주일 안에 포함되는 날짜의 배열. HDay Arrary */
  private _days: HCalendarDay[]    = [];

  /** 날짜 배열에 포함된 날짜의 갯수         */
  private _count: number      = 0;

  constructor() {
    this.now();
  }

  /**
   * 날짜를 리턴하는 게터
   */
  get today()            { return this._today;    }

  /**
   * 날짜를 설정하는 세터
   */
  set today(arg: HCalendarDay)        { this._today = arg;    }

  get days()            { return this._days; }

  /** 날짜의 갯수를 설정한다. */
  set count(arg: number)      { this._count = arg;  }
  /** 일주일 포함된 날자의 수를 리턴한다.     */
  get count(): number      { return this._count;  }

  /**
   * 일주일 중 첫번째 날을 리턴한다.
   */
  public first(): HCalendarDay      { return this._days[0]; }
  /**
   * 일주일 중 마지막 날을 리턴한다.
   */
  public last(): HCalendarDay      { return this._days[HCalendarConst.MAX_DAYOFWEEK - 1]; }

  /**
   * 일주일 중 i 번째에 해당하는 날을 리턴한다.
   * @param i
   */
  public index(i: number): HCalendarDay |null {
    return this.indexAt(i);
  }

  /**
   * 일주일 중 i 번째에 해당하는 날을 리턴한다.
   * @param i
   */
  public indexAt(i: number): HCalendarDay |null {
    if ( i < 0 )                { return null; }
    if ( i >= HCalendarConst.MAX_DAYOFWEEK)  { return null; }

    return this._days[i];
  }



  /**
   * 현재 시간으로 주간을 설정한다.
   */
  public now() {
    const current      = new Date();
    this._today.set( current );
    this._today.setKind(current.getMonth());

    this.init( this._today.year, this._today.month, this._today.date );
  }

  /**
   * y,m,d 로 설정된 날짜를 세팅하고, 날짜가 포함된 주를 구한다.
   * 주 첫날과 마지막 날을 게산하고, 날짜 배열에 해당하는 날짜를 넣어 둔다.
   * 각 날짜는 HDay 로 저장하며, 날짜 별 '날짜 구분' 값도 설정한다.
   * @param y 년
   * @param m 월
   * @param d 일
   */
  public init( y: number, m: number, d: number ): number {

    // 매우 간단한 벨리데이션, 나중에 isValid 함수를 이용하는 것이 좋겠다.
    if ( y < 1970 )            { return 0; }
    if ( m < 0 )              { return 0; }
    if ( m >= HCalendarConst.MAX_MONTH )  { return 0; }
    if ( d < 1 )              { return 0; }
    if ( d > 31 )              { return 0; }

    this._today.year  = y;  // 설정하려는 년
    this._today.month  = m;  // 설정하려는 월
    this._today.date  = d;  // 설정하려는 일

    // let aday      = moment( { year:y, month:m, date:d} );
    const firstDay    = moment( { year: y, month: m, date: d} );
    const lastDay      = moment( { year: y, month: m, date: d} );

    firstDay.day( 0 );      // 날짜 앞쪽의 일요일을 구한다.
    lastDay.day( 6 );      // 날짜 뒤쪽의 주말 날짜를 구한다.

    this._count    = lastDay.diff(firstDay, 'days') + 1;

    let cur = moment(firstDay);
    for ( let i = 0; i < this._count; i++ ) {
      const iday = cur.add( i, 'days' );

      const today = new HCalendarDay();
      today.year = iday.year();
      today.month = iday.month();
      today.date = iday.date();
      today.name = '';
      today.setKindWithMonth( cur.year(), cur.month(), cur.date(), this._today.month );
      today.sum = 0;
      today.count = 0;

      this._days[i] = today;

      cur = moment(firstDay);
    }

    return this._count;
  }

  /**
   * index 번재의 HDay 에 건수와 금액을 설정한다.
   * @param index 몇 번째 날짜를 설정할지
   * @param count 건수
   * @param sum 금액
   */
  public setAt( index: number, count: number, sum: number ): number {
    if ( index < 0 ) { return -1; }
    if ( index >= HCalendarConst.MAX_DAYOFWEEK) { return 7; }

    this._days[index].count = count;
    this._days[index].sum = sum;

    return index;
  }

  /**
   * HDay 에 해당하는 날짜를 찾아 값을 설정한다.
   * @param date 날짜
   * @param count 갯수
   * @param sum 금액
   */
  public setAtDay( day: HCalendarDay, count: number, sum: number ): number {
    if ( day === null ) { return -1; }
    if ( day === undefined ) { return -1; }

    let i = 0;
    for ( const aday of this._days ) {
      if ( aday.equalDay( day ) ) {
        aday.count = count;
        aday.sum = sum;
        return i;
      }
      i++;
    }

    return i;
  }

  /**
   * 년/월/일 에 해당하는 날짜를 찾아 값을 설정한다.
   * @param date 날짜
   * @param count 갯수
   * @param sum 금액
   */
  public setAtDate( year: number, month: number, date: number, count: number, sum: number ): number {
    if ( year === null ) { return -1; }
    if ( year === undefined ) { return -1; }
    if ( month === null ) { return -1; }
    if ( month === undefined ) { return -1; }
    if ( date === null ) { return -1; }
    if ( date === undefined ) { return -1; }

    let i = 0;
    for ( const aday of this._days ) {
      if ( aday.equalDate( year, month, date ) ) {
        aday.count = count;
        aday.sum = sum;
        return i;
      }
      i++;
    }

    return i;
  }

  /**
   * 주어진 날짜로 내부값을 설정하고, 해당하는 주를 날짜 배열로 리턴한다.
   * @param y 년
   * @param m 월
   * @param d 일
   */
  public getWeek( y: number, m: number, d: number ): HCalendarDay[] {
    this.init( y, m, d );
    return this._days;
  }

  /**
   * 내부의 날짜 배열을 리턴한다.
   */
  public get(): HCalendarDay[] {
    return this._days;
  }

  /**
   * 문자열로 리턴한다.
   */
  public toString(): string {
    let s = '';
    for ( let i =  0; i < this._count; i++ ) {
      s += (`(${this._days[i]})` + ',');
    }
    return `(${this.first()})~(${this.last()})=>` + s;
  }

}

export default HCalendarWeek;
export { HCalendarWeek };
