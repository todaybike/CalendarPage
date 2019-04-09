<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="cpage">
    <button v-on:click="cpage1()">현재 월에 해당하는 페이지 가져오기</button><br>
    <button v-on:click="cpage2()">다음 달 가져오기</button><br>
    <button v-on:click="cpage3()">이전 달 가져오기</button>
    <hr>
    <div class="dlog" v-html="dlog"></div>
    <div class="dlog"><pre>{{ logs1 }}</pre></div>
    <hr>

    <select v-model="wyear">
      <option value=2014>2014</option>
      <option value=2015>2015</option>
      <option value=2016>2016</option>
      <option value=2017>2017</option>
      <option value=2018>2018</option>
      <option value=2019>2019</option>
      <option value=2020>2020</option>
      <option value=2021>2021</option>
    </select>
    <select v-model="wmonth">
      <option value=00>01</option>
      <option value=01>02</option>
      <option value=02>03</option>
      <option value=03>04</option>
      <option value=04>05</option>
      <option value=05>06</option>
      <option value=06>07</option>
      <option value=07>08</option>
      <option value=08>09</option>
      <option value=09>10</option>
      <option value=10>11</option>
      <option value=11>12</option>
    </select>
    <select v-model="wday">
      <option value=01>01</option>
      <option value=02>02</option>
      <option value=03>03</option>
      <option value=04>04</option>
      <option value=05>05</option>
      <option value=06>06</option>
      <option value=07>07</option>
      <option value=08>08</option>
      <option value=09>09</option>
      <option value=10>10</option>

      <option value=11>11</option>
      <option value=12>12</option>
      <option value=13>13</option>
      <option value=14>14</option>
      <option value=15>15</option>
      <option value=16>16</option>
      <option value=17>17</option>
      <option value=18>18</option>
      <option value=19>19</option>
      <option value=20>20</option>

      <option value=21>21</option>
      <option value=22>22</option>
      <option value=23>23</option>
      <option value=24>24</option>
      <option value=25>25</option>
      <option value=26>26</option>
      <option value=27>27</option>
      <option value=28>28</option>
      <option value=29>29</option>
      <option value=30>30</option>
      <option value=31>31</option>

    </select>
    <button v-on:click="cpage4()">월 정보 갖고와라 </button>
    <button v-on:click="cpage5()">일이 포함된 주 단위 정보 갖고와라 </button>
    <hr>
    <div class="dlog" v-html="dlog2"></div>
    <div class="dlog"><pre>{{ logs2 }}</pre></div>
    </div>

		<hr>
		<h3>QR CODE </h3>
		<div class="qrcode">
			
			<input v-model="qrcodeInput" value="한글로 연습해보자"/> <button v-on:click="cpage6()">QR 그려바바</button><br>
			<canvas id="qrcodeCanvas" ref="canvas1" width=300 height=300></canvas><br>
			<br>

			<input v-model="barcodeInput" value="123456789"/> <button v-on:click="cpage7()">BAR 그려바바</button><br>
			<canvas id="barcodeCanvas" ref="canvas2" width=300 height=300></canvas><br>
			<br>

		</div>

  </div>


</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import { HCalendarPage } from './HCalendar';
import { HCalendarWeek } from './HCalendarWeek';
import { HCalendarDay } from './HCalendarDay';
import { HCalendarConst } from './HCalendarConst';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import Canvas from 'canvas';

@Component
export default class HelloWorld extends Vue {

	public page = new HCalendarPage();
	public logs1: string = '';
	public logs2: string = '';
	public dlog: string = '';
	public dlog2: string = '';
	public wyear: string = '2019';
	public wmonth: string = '03';
	public wday: string = '05';
	public days: HCalendarDay[] = [];
	public week: HCalendarWeek = new HCalendarWeek();

	public qrcodeInput: string = '한글로 시작해 볼까요 ?';
	public barcodeInput: string = '20190408110901';

	@Prop() private msg!: string;

	/**
	 * 현재 날짜를 기준으로 달력 페이지를 가져 온다.
	 */
	public async cpage1() {
		this.page.now();    // 현재 날짜를 가져 온다.

		// 서버에서 데이터를 가져오게 하자.
		await axios({
			method: 'GET',
			url: 'http://localhost:8080/calendar.jsp',
			params: { line: 1 },

			})
			.then( (res: any) => {
				// const json = JSON.parse(res.data);
				// console.log(res.data);

				const json = res.data.list;

// json 내역을 돌면서 세팅하자.
				let i = 0;
				for ( const j of json ) {
					this.page.setDate( Number(j.year), Number(j.month), Number(j.date), j.sum, j.count );
					i++;
				}

			})
			.catch( (ex: any) => {
				console.log('error:' + ex );
				// this.stringServerEncoded = '';
			});

		this.log1( this.page.toString() );

	}

	/**
	 * 페이지의 현재 날짜를 기준으로 다음 달을 가져온다.
	 */
	public cpage2() {
		this.page.next();   // 다음 달력을 가져 온다.
		this.log1( this.page.toString() );
	}

	public cpage3() {
		this.page.prev();   // 이전 달을 가져 온다.
		this.log1( this.page.toString() );
	}

	public cpage4() {
		this.page.init( parseInt(this.wyear, 10), parseInt(this.wmonth, 10) );
		this.log2( this.page.toString() );
	}

	public cpage5() {
		this.week.init( parseInt(this.wyear, 10), parseInt(this.wmonth, 10), parseInt(this.wday, 10) );
		this.log2( this.week.toString() );
	}

	public cpage6() {
		let qrcanvas = document.getElementById('qrcodeCanvas');
		// let canvas = this.$refs.canvas1.$el;
		QRCode.toCanvas( qrcanvas, this.qrcodeInput,
			{ width:300, color:{ dark:"#F43233", light:"#ffffff"}} )
		.then( (url:any) => { console.log(url); })
		.catch( (err:any) => {console.error(err); });
	}

	public cpage7() {
		let barcanvas = document.getElementById('barcodeCanvas');
		JsBarcode( barcanvas, this.barcodeInput,
			{
				// format: "pharmacode",
				lineColor: "#0aa",
				// width:4,
				height:80,
				displayValue: true
			}
		);
	}

	public log1( line: string ) {
		// console.log( line );
		const aline = line.replace(/ /g, '');
		const bline = aline.replace(/>/g, '>\n');
		this.logs1 = bline.replace(/\,/g, '\n');

		let dline: string = '';
		// this.days = this.page.days;
		let d: number = 0;
		for ( let w = 0; w < this.page.countWeek; w++ ) {
			for ( let i = 0; i < 7; i++ ) {
				const da = this.page.days[d++];
				//
				// dline += `<div style="display: inline-block; font-size:10pt; border:
				// solid 2px red; width:40px; height: 40px;">${da.month+1}/${da.date}</div> `;
				let dc = 'dlog_date';
				switch ( da.kind ) {
					case HCalendarConst.KIND_DATE_NORMAL : dc = 'dlog_date_normal'; break;
					case HCalendarConst.KIND_DATE_SUN : dc = 'dlog_date_sun'; break;
					case HCalendarConst.KIND_DATE_SAT : dc = 'dlog_date_sat'; break;
					case HCalendarConst.KIND_DATE_EVENT : dc = 'dlog_date_event'; break;
					case HCalendarConst.KIND_DATE_NO_MONTH : dc = 'dlog_date_no_month'; break;
				}
				dline += `<div class="${dc}">${da.month + 1}/${da.date}`
						+ `<div class="dlog_date_sum">${da.sum}</div>`
						+ `</div> `;
			}
			dline += '<br>\n';
		}

		this.dlog = dline;
	}

	public log2( line: string ) {
		// console.log( line );
		const aline = line.replace(/ /g, '');
		const bline = aline.replace(/>/g, '>\n');
		this.logs2 = bline.replace(/\,/g, '\n');

		let dline: string = '';
		for ( let i = 0; i < 7; i++ ) {
				const da = this.week.days[i];
				//
				// dline += `<div style="display: inline-block; font-size:10pt; border:
				// solid 2px red; width:40px; height: 40px;">${da.month+1}/${da.date}
				// </ div> `;
				dline += `<div class="dlog_date">${da.month + 1}/${da.date}</div> `;
		}

		this.dlog2 = dline;
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cpage { text-align: left; }
.log { font-size: 12pt; }
.dlog { width: 100%; }
.dlog {
  /deep/ .dlog_date { display: inline-block; font-size:10pt; border: solid 2px black; width:40px; height:50px;  }
  /deep/ .dlog_date_normal { display: inline-block; font-size:10pt; border: solid 2px black; width:40px; height:50px;  }
  /deep/ .dlog_date_sun { display: inline-block; font-size:10pt; border: solid 2px red; width:40px; height:50px;  }
  /deep/ .dlog_date_sat { display: inline-block; font-size:10pt; border: solid 2px blue; width:40px; height:50px;  }
  /deep/ .dlog_date_event { display: inline-block; font-size:10pt; border: solid 2px blue; width:40px; height:50px;  }
  /deep/ .dlog_date_no_month { display: inline-block; font-size:8pt; border:
														solid 2px lightgrey; width:40px; height:50px;  }
	/deep/ .dlog_date_sum { font-size:5pt; }
}

</style>
