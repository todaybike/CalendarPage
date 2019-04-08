import moment from 'moment';
import HCalendarConst from './HCalendarConst';

/**
 * 날짜 하나에 담아야 할 정보를 기술한다.
 * 년,월,일, 기념일 구분, 기념일이라면 그 이름, 사용한 금액, 건수.
 * 처음에는 날짜만 담고자 했으나, 편의를 위하여 일자별 표시 정보도 함께 넣었다.
 */
class HCalendarDay {
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
	private _name: string = '';
	/** 날짜 구분. 0=일요일, 1=평일, 6=토, 7=기념일, 8=현재 달 아님, UI 표현의 편리를 위해 8값을 새로 만든.  */
	private _kind: number = 0;
	/** 날짜에 표시되는 금액. API 호출 후 설정되어야 함. 0이거나 없으면 표시하지 않는 것으로 ... */
	private _sum: number = 0;
	/** 날짜에 표시되는 이용 건수. API 호출 후 설정되어야 함. */
	private _count: number = 0;		// 갯수

	/**
	 * 생성자. 년,월,일로 생성한다. 날짜의 구분값도 여기서 설정한다.
	 * 다만, 월이 다른 경우는 HDay 내부적으로 알 수가 없다.
	 * 따라서, setKind(month) 를 이용하여야, 달과 비교하여 해당 월의 날이 아닌지 설정할 수 있게 된다.
	 * @param y
	 * @param m
	 * @param d
	 */
	public constuctor( y: number, m: number, d: number ): HCalendarDay {
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
	public set( arg: Date): HCalendarDay	{
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
	 * 모든 값이 동일한지 비교한다.
	 * @param day HDay 객체
	 */
	public equal( day: HCalendarDay ): boolean {
		if ( day === null ) { return false; }
		if ( day === undefined ) { return false; }

		if (
				( this._year === day._year ) &&
				( this._month === day._month ) &&
				( this._date === day._date ) &&
				( this._kind === day._kind ) &&
				( this._name === day._name ) &&
				( this._sum === day._sum ) &&
				( this._count === day._count )
		) {
			return true;
		}

		return false;
	}

	/**
	 * 주어진 HDay 와 비교하여 날짜가 같으면 참을 리턴한다.
	 * @param day HDay
	 */
	public equalDay( day: HCalendarDay ): boolean {
		if ( day === null ) { return false; }
		if ( day === undefined ) { return false; }

		if (
				( this._year === day._year ) &&
				( this._month === day._month ) &&
				( this._date === day._date )
		) {
			return true;
		}

		return false;
	}

	/**
	 * 일반 함수용으로 만들었다. 년/월/일 이 주어지면 같은 날짜인지 비교한다.
	 * @param year 년
	 * @param month 월
	 * @param date 일
	 */
	public equalDate( year: number, month: number, date: number ): boolean {
		if ( year === null ) { return false; }
		if ( year === undefined ) { return false; }
		if ( month === null ) { return false; }
		if ( month === undefined ) { return false; }
		if ( date === null ) { return false; }
		if ( date === undefined ) { return false; }

		if (
				( this._year === year ) &&
				( this._month === month ) &&
				( this._date === date )
		) {
			return true;
		}

		// console.log(`HCalendarDay.equalDate(): ${this._year}===${year}, `
		// + `${this._month} === ${month}, ${this._date} === ${date}`);

		return false;
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

export default HCalendarDay;
export { HCalendarDay };
