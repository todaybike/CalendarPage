/**
 * 달력을 위한 상수
 */
class HCalendarConst {
  /**
   * 일주일의 최대 날수
   */
  public static readonly MAX_DAYOFWEEK: number    = 7;

  /**
   * 1년의 최대 월 수
   */
  public static readonly MAX_MONTH: number      = 12;

  /**
   * 달력 페이지에 보이는 최대 날짜 수
   */
  public static readonly MAX_PAGE_DAY: number    = 42;
  /**
   * 달력 페이지에 보이는 최대 주 수
   */
  public static readonly MAX_PAGE_WEEK: number    = 6;

  /**
   * 날짜 구분 : 평일 1
   */
  public static readonly KIND_DATE_NORMAL: number  = 1;

  /**
   * 날짜 구분 : 일요일 0
   */
  public static readonly KIND_DATE_SUN: number     = 0;

  /**
   * 날짜 구분 : 토요일 6
   */
  public static readonly KIND_DATE_SAT: number     = 6;

  /**
   * 날짜 구분 : 기념일 7
   */
  public static readonly KIND_DATE_EVENT: number  = 7;

  /**
   * 날짜 구분 : 이번달 아님 8
   */
  public static readonly KIND_DATE_NO_MONTH: number  = 8;
}


export default HCalendarConst;
export { HCalendarConst };
