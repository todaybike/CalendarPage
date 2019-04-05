import moment from 'moment';

/**
 * 달력을 위한 상수
 */
class HCalendarConst {
	/**
	 * 일주일의 최대 날수
	 */
	public static readonly MAX_DAYOFWEEK: number		= 7;

	/**
	 * 1년의 최대 월 수
	 */
	public static readonly MAX_MONTH: number			= 12;

	/**
	 * 달력 페이지에 보이는 최대 날짜 수
	 */
	public static readonly MAX_PAGE_DAY: number		= 42;
	/**
	 * 달력 페이지에 보이는 최대 주 수
	 */
	public static readonly MAX_PAGE_WEEK: number		= 6;

	/**
	 * 날짜 구분 : 평일 1
	 */
	public static readonly KIND_DATE_NORMAL: number	= 1;

	/**
	 * 날짜 구분 : 일요일 0
	 */
	public static readonly KIND_DATE_SUN: number 		= 0;

	/**
	 * 날짜 구분 : 토요일 6
	 */
	public static readonly KIND_DATE_SAT: number 		= 6;

	/**
	 * 날짜 구분 : 기념일 7
	 */
	public static readonly KIND_DATE_EVENT: number	= 7;

	/**
	 * 날짜 구분 : 이번달 아님 8
	 */
	public static readonly KIND_DATE_NO_MONTH: number	= 8;
}

/**
 * 날짜 하나에 담아야 할 정보를 기술한다.
 * 년,월,일, 기념일 구분, 기념일이라면 그 이름, 사용한 금액, 건수.
 * 처음에는 날짜만 담고자 했으나, 편의를 위하여 일자별 표시 정보도 함께 넣었다.
 */
class HDay {
	/** 년 */
	private _year: number	= 2019;
	/** 월 */
	private _month: number	= 3;
	/** 일  */
	private _date: number	= 22;

	get year()								{ return this._year;	}
	set year(arg: number)			{ this._year = arg;		}

	get month()								{ return this._month;	}
	set month(arg: number)		{ this._month = arg;	}

	get date()								{ return this._date;	}
	set date(arg: number)			{ this._date = arg;		}

	/** 기념일 이름, API 호출 후에 세팅될 것으로 예상.			 */
	private _name  : string = '';
	/** 날짜 구분. 0=일요일, 1=평일, 6=토, 7=기념일, 8=현재 달 아님, UI 표현의 편리를 위해 8값을 새로 만든.  */
	private _kind  : number = 0;
	/** 날짜에 표시되는 금액. API 호출 후 설정되어야 함. 0이거나 없으면 표시하지 않는 것으로 ... */
	private _sum   : number = 0;
	/** 날짜에 표시되는 이용 건수. API 호출 후 설정되어야 함. */
	private _count : number = 0;		// 갯수

	/**
	 * 생성자. 년,월,일로 생성한다. 날짜의 구분값도 여기서 설정한다.
	 * 다만, 월이 다른 경우는 HDay 내부적으로 알 수가 없다. 
	 * 따라서, setKind(month) 를 이용하여야, 달과 비교하여 해당 월의 날이 아닌지 설정할 수 있게 된다.
	 * @param y
	 * @param m
	 * @param d
	 */
	public constuctor( y: number, m: number, d: number ): HDay {
		this._setKind( y, m, d );
		// if ( this._month != withMonth ) { this._kind = HCalendarConst.KIND_DATE_NO_MONTH }
		return this;
	}

	get name()							{ return this._name;	}
	set name(arg: string)		{ this._name = arg;		}

	get kind()							{ return this._kind;	}
	set kind(arg: number)		{ this._kind = arg;		}

	get sum()								{ return this._sum;		}
	set sum(arg: number)		{ this._sum = arg;		}

	get count()							{ return this._count;	}
	set count(arg: number)	{ this._count = arg;	}

	/**
	 * 문자열로 내부 값을 리턴합니다.
	 */
	public toString()		{
		return	`${this._year}/${this._month}/${this._date}:` +
				`'${this._name}'/${this._kind}/${this._sum}/${this._count}`;
	}


	/**
	 * Date 객체를 받아 값을 설정하는 편의 함수.
	 * @param arg Date 객체
	 */
	public set( arg: Date): HDay	{
		this._year	= arg.getFullYear();
		this._month	= arg.getMonth();
		this._date	= arg.getDate();
		this._setKind( this._year, this._month, this._date );

		return this;
	}

	/**
	 * 지정한 월을 받아 날짜 구분값을 설정하는 편의 함수.
	 * withMonth 로 저정한 날짜와 this._month 와 비교하여 날가 구분값을 설정한다.
	 * HDay 에서는 이번 달에 속한 날짜인지를 확인할 수 없기 때문이다.
	 * HDay 클래서 바깥에서 비교할 달 (withMonth) 을 알려 주어야 한다.
	 * @param withMonth 지정한 월.
	 */
	public setKind( withMonth: number ): number {
		return this.setKindWithMonth( this._year, this._month, this._date, withMonth );
	}

	/**
	 * 날짜를 입력받아 날짜 구분을 설정한다.
	 * 내부적으로는 _setKind() 를 호출하여 구분값을 설정하고,
	 * 이번 달에 속하지 않는 날짜의 경우는 KIND_DATE_NO_MONTH (8) 값을 설정하도록 했다.
	 * HWeek, HCalendarPage 등에서 이번 달에 속하지 않는 날짜에 NO_MONTH 값을 설정하여,
	 * vue 단에서 쉽게 ui 를 구현하도록 했다.
	 * @param y 년
	 * @param m 월
	 * @param d 일
	 * @param withMonth 지정한 월.
	 */
	public setKindWithMonth( y: number, m: number, d: number, withMonth: number ): number {
		this._setKind( y, m, d );
		if ( this._month !== withMonth ) { this._kind = HCalendarConst.KIND_DATE_NO_MONTH; }

		return this._month;
	}

	/**
	 * 날짜를 입력받아 내부 날짜를 구성하고,
	 * 날짜 구분을 설정하는 내부 함수.
	 * 평일=1, 일요일=0, 토요일=6 로 구분하여 설정한다.
	 * @param y 년
	 * @param m 월
	 * @param d 일
	 */
	protected _setKind( y: number, m: number, d: number ): number {

		// moment.js 를 이용하여 내부 값을 설정한다.
		const today = moment( { year: y, month: m, date: d } );

		// 날짜 구분값을 설정한다.
		switch ( today.day() ) {
			 case 0 : this._kind = HCalendarConst.KIND_DATE_SUN;	break;	// 일
			 case 1 : this._kind = HCalendarConst.KIND_DATE_NORMAL;	break;	// 월
			 case 2 : this._kind = HCalendarConst.KIND_DATE_NORMAL;	break;	// 화
			 case 3 : this._kind = HCalendarConst.KIND_DATE_NORMAL;	break;	// 수
			 case 4 : this._kind = HCalendarConst.KIND_DATE_NORMAL;	break;	// 목
			 case 5 : this._kind = HCalendarConst.KIND_DATE_NORMAL;	break;	// 금
			 case 6 : this._kind = HCalendarConst.KIND_DATE_SAT;	break;	// 토
		}

		return this._kind;
	}
}

/**
 * 일주일을 표현하는 클래스
 * 필요한 날짜를 지정하면, 날짜가 속한 일주일을 가져 온다.
 * 날짜는 배열로 갖고 있으며, 날짜에는 구분 코도가 세팅된다.
 */
class HWeek {
	/**
	 *  오늘 날짜, 정확하게는 그냥 날짜
	 */
	private _today : HDay			= new HDay();

	/** 일주일 안에 포함되는 날짜의 배열. HDay Arrary */
	private _days: Array<HDay>		= [];

	/** 날짜 배열에 포함된 날짜의 갯수				 */
	private _count: number			= 0;

	constructor() {
		this.now();
	}

	/**
	 * 날짜를 리턴하는 게터
	 */
	get today()						{ return this._today;		}
	/**
	 * 날짜를 설정하는 세터
	 */
	set today(arg: HDay)				{ this._today = arg;		}

	get days()						{ return this._days; }

	/**
	 * 일주일 중 첫번째 날을 리턴한다.
	 */
	public first(): HDay			{ return this._days[0]; }
	/**
	 * 일주일 중 마지막 날을 리턴한다.
	 */
	public last(): HDay			{ return this._days[HCalendarConst.MAX_DAYOFWEEK - 1]; }

	/**
	 * 일주일 중 i 번째에 해당하는 날을 리턴한다.
	 * @param i
	 */
	public index(i: number): HDay |null {
		if ( i < 0 )								{ return null; }
		if ( i >= HCalendarConst.MAX_DAYOFWEEK)	{ return null; }

		return this._days[i];
	}

	// set count(arg:number)			{ this._count = arg;	}
	/** 일주일 포함된 날자의 수를 리턴한다.		 */
	get count(): number			{ return this._count;	}

	/**
	 * 현재 시간으로 주간을 설정한다.
	 */
	public now() {
		const current			= new Date();
		this._today.set( current );
		this._today.setKind(current.getMonth());

		this.set( this._today.year, this._today.month, this._today.date );
	}

	/**
	 * y,m,d 로 설정된 날짜를 세팅하고, 날짜가 포함된 주를 구한다.
	 * 주 첫날과 마지막 날을 게산하고, 날짜 배열에 해당하는 날짜를 넣어 둔다.
	 * 각 날짜는 HDay 로 저장하며, 날짜 별 '날짜 구분' 값도 설정한다.
	 * @param y 년
	 * @param m 월
	 * @param d 일
	 */
	public set( y: number, m: number, d: number ): number {

		// 매우 간단한 벨리데이션, 나중에 isValid 함수를 이용하는 것이 좋겠다.
		if ( y < 1970 )							{ return 0; }
		if ( m < 0 )							{ return 0; }
		if ( m >= HCalendarConst.MAX_MONTH )	{ return 0; }
		if ( d < 1 )							{ return 0; }
		if ( d > 31 )							{ return 0; }

		this._today.year	= y;	// 설정하려는 년
		this._today.month	= m;	// 설정하려는 월
		this._today.date	= d;	// 설정하려는 일

		// let aday			= moment( { year:y, month:m, date:d} );
		const firstDay		= moment( { year: y, month: m, date: d} );
		const lastDay			= moment( { year: y, month: m, date: d} );

		firstDay.day( 0 );			// 날짜 앞쪽의 일요일을 구한다.
		lastDay.day( 6 );			// 날짜 뒤쪽의 주말 날짜를 구한다.

		this._count		= lastDay.diff(firstDay, 'days') + 1;

		let cur = moment(firstDay);
		for ( let i = 0; i < this._count; i++ ) {
			const iday = cur.add( i, 'days' );

			const today = new HDay();
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
	 * 주어진 날짜로 내부값을 설정하고, 해당하는 주를 날짜 배열로 리턴한다.
	 * @param y 년
	 * @param m 월
	 * @param d 일
	 */
	public getWeek( y: number, m: number, d: number ): HDay[] {
		this.set( y, m, d );
		return this._days;
	}

	/**
	 * 내부의 날짜 배열을 리턴한다.
	 */
	public get(): HDay[] {
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

	/** 현재의 날짜를 담고 있다. next(), prev() 함수 호출 후에는 매월 1일로 세팅된다.	 */
	private _today : HDay	= new HDay();
	/** 화면 상에 표시되는 첫번째 날을 담고 있다.			 */
	private _start : HDay	= new HDay();
	/** 화면 상에 표시되는 마지막 날을 담고 있다.			 */
	private _end : HDay		= new HDay();

	/** 표시되는 달의 주 수. 4,5,6 중에 하나가 될 것이다.	 */
	private _countWeek : number		= 5;
	/** 표시되는 달에 날 수, 25, 35, 42 중에 하나가 된다.	 */
	private _countDay : number		= 42;
	/** 표시되는 달에 포함된 모든 날짜를 담고 있다. HDay Array	 */
	private _days: HDay[] = [];

	constructor()	{ this.now();	}

	get today()							{ return this._today;			}
	set today(arg: HDay)		{ this._today = arg;			}

	get year()							{ return this._today.year;	}
	set year(arg: number)		{ this._today.year = arg;		}

	get month()							{ return this._today.month;	}
	set month(arg: number)	{ this._today.month = arg;	}

	get date()							{ return this._today.date;	}
	set date(arg: number)		{ this._today.date = arg;		}

	get start()							{ return this._start;		}
	set start(arg: HDay)		{ this._start = arg;		}

	get end()								{ return this._end;			}
	set end(arg: HDay)			{ this._end = arg;			}

	get countWeek()	{ return this._countWeek;	}
	get countDay()	{ return this._countDay;	}
	get days()			{ return this._days;			}


	/**
	 * 현재 시간으로  달력 페이지를 설정한다.
	 */
	public now() {
		const current			= new Date();
		this._today.set( current );
		this._today.setKind(current.getMonth());

		this.set( this._today.year, this._today.month );
	}

	/**
	 * 다음 달로 내부 데이터를 업데이트한다.
	 * 날짜는 다음 달 1일로 지정한다.
	 */
	public next() {
		const nextDate = new Date( this._today.year, this._today.month + 1, 1 );
		this._today.set( nextDate );
		this.set( nextDate.getFullYear(), nextDate.getMonth() );
	}

	/**
	 * 이전 달로 내부 데이터를 업데이트한다.
	 * 날짜는 이전 달 1일로 지정한다.
	 */
	public prev() {
		const prevDate = new Date( this._today.year, this._today.month - 1, 1 );
		this._today.set( prevDate );
		this.set( prevDate.getFullYear(), prevDate.getMonth() );
	}

	/**
	 * 주어진 년/월 로 날짜 배열에 저장한다.
	 * 날짜는 주어지지 않으면 1일로 지정한다.
	 * @param y
	 * @param m
	 * @param d=1, 값이 주어지지 않으면 1로 세팅된다.
	 */
	public set( y: number, m: number, d: number = 1 ): number {

		// 매우 간단한한 체크, 이 부분은 강호할 필요가 있다.
		if ( y < 1970 )							{ return 0; }
		if ( m < 0 )							{ return 0; }
		if ( m >= HCalendarConst.MAX_MONTH )	{ return 0; }

		this._today.year	= y;
		this._today.month	= m;
		this._today.date	= d;

		const firstDate		= new Date(y, m, 1);		// 해당 월의 첫번째 날을 구한다.
		const lastDate		= new Date(y, m + 1, 0);		// 해당 월의 마지막 날을 구한다.

		const firstDayOfWeek	= firstDate.getDay();		// 첫번째 날의 주중 인덱스를 구한다.
		const lastDayOfWeek	= lastDate.getDay();		// 마지막 날의 인덱스를 구한다.

		// 첫째 날이 속한 주간의 첫번째 날을 구한다.
		// 달력 페이지에 보이는 첫번째 날이다. 해당 월의 첫번째와는 구분되어야 한다.
		const viewFirstDate	= new Date( y, m, -(firstDayOfWeek - 1) );
		this._start			= (new HDay()).set( viewFirstDate );
		this._start.setKind( this._today.month );

		// 마지막 날이 속한 주간의 마지막 날을 구한다.
		// 해당 페이지의 마지막 날짜를 구하게 된다.
		// 클래스 설명에서 보는 것처럼, 달력의 페이지에 표시되는 가장 마자믹 날짜다.
		const viewLastDate	= new Date( y, m + 1, (6 - lastDayOfWeek) );
		this._end			= (new HDay()).set( viewLastDate );
		this._end.setKind( this._today.month );

		// moment 로 변환하는 것은 두 날짜 사이의 거리를 구하기 위해서다.
		// 거리(날짜 수) 를 구하여, 날짜 배열에 날짜를 생성하여 지정한다.
		const first			= moment(viewFirstDate);
		const last			= moment(viewLastDate);
		this._countDay		= last.diff(first, 'days') + 1;			// 첫날-마지막 날의 차이, 달력에 표시되는 일자 갯수
		this._countWeek		= this._countDay / HCalendarConst.MAX_DAYOFWEEK;	// 달력에 표시되는 주 갯수

		//
		// 일자 배열에 모든 날짜를 생성하여 넣어 둔다.
		// 현재의 달과 비교하여, DATE_KIND 값도 설정한다. 이번 달의 날짜가 아니면 NO_MONTH (8) 로 설정된다.
		// 아래 for 문에서 cur 값을 리셋하는 것은 moment.js 함수의 특성인데,
		// add() 함수를 수행하고 나면, cur 의 값이 변경되어 간격을 계산하기 어렵다. for() 문을 사용했기 때문이다.
		// while() 문을 사용하여 1씩 더면하면 문제가 해결될 것 같기도 한데 ...
		// 서버 통신 후 일자별 이벤트를 등록하기 위해 배열을 초기화 해둔다.
		let cur = moment(viewFirstDate);
		for ( let i = 0; i < this._countDay; i++ ) {
			const iday = cur.add( i, 'days' );		// 현재

			const today = new HDay();
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

		return this._countDay;
	}

	/** 문자열로 바꿔 줍니다.  */
	public toString(): string {
		return ''
		+ `today=(${this.today}), `
		+ `start=${this.start}, `
		+ `end=${this.end}, `
		+ `countDay: ${this._countDay},`
		+ `countWeek : ${this._countWeek},`
		;

	}

}

class HCalendar {
	private HCalendarPage = new HCalendarPage();
}

export default HCalendarPage;
export { HCalendarConst, HDay, HWeek, HCalendarPage };
