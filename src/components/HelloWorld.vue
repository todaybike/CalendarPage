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
  </div>

  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { HCalendarPage, HWeek, HDay, HCalendarConst } from './HCalendar';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  page = new HCalendarPage();
  logs1 : string = '';
  logs2 : string = '';
  dlog  : string = '';
  dlog2  : string = '';
  wyear : string = '2019';
  wmonth : string = '03';
  wday : string = '05';
  days : Array<HDay> = [];

  week : HWeek = new HWeek();

  /**
   * 현재 날짜를 기준으로 달력 페이지를 가져 온다.
   */
  public cpage1() {
    this.page.now();    // 현재 날짜를 가져 온다.
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
    this.page.set( parseInt(this.wyear), parseInt(this.wmonth) );
    this.log2( this.page.toString() );
  }

  public cpage5() {
    this.week.set( parseInt(this.wyear), parseInt(this.wmonth), parseInt(this.wday) );
    this.log2( this.week.toString() );
  }

  public log1( line: string ) {
    // console.log( line );
    let aline = line.replace(/ /g, '');
    let bline = aline.replace(/>/g, '>\n');
    this.logs1 = bline.replace(/\,/g, '\n');

    let dline:string = "";
    // this.days = this.page.days;
    let d:number = 0;
    for ( let w=0; w<this.page.countWeek; w++ ) {
      for ( let i=0; i<7; i++ ) {
        let da = this.page.days[d++];
        //
        // dline += `<div style="display: inline-block; font-size:10pt; border: solid 2px red; width:40px; height: 40px;">${da.month+1}/${da.date}</div> `;
        let dc = "dlog_date";
        switch ( da.kind ) {
          case HCalendarConst.KIND_DATE_NORMAL : dc = "dlog_date_normal"; break;
          case HCalendarConst.KIND_DATE_SUN : dc = "dlog_date_sun"; break;
          case HCalendarConst.KIND_DATE_SAT : dc = "dlog_date_sat"; break;
          case HCalendarConst.KIND_DATE_EVENT : dc = "dlog_date_event"; break;
          case HCalendarConst.KIND_DATE_NO_MONTH : dc = "dlog_date_no_month"; break;
        }
        dline += `<div class="${dc}">${da.month+1}/${da.date}</div> `;
      }
      dline += "<br>\n";
    }

    this.dlog = dline;
  }

  public log2( line: string ) {
    // console.log( line );
    let aline = line.replace(/ /g, '');
    let bline = aline.replace(/>/g, '>\n');
    this.logs2 = bline.replace(/\,/g, '\n');

    let dline:string = "";
    for ( let i=0; i<7; i++ ) {
        let da = this.week.days[i];
        //
        // dline += `<div style="display: inline-block; font-size:10pt; border: solid 2px red; width:40px; height: 40px;">${da.month+1}/${da.date}</div> `;
        dline += `<div class="dlog_date">${da.month+1}/${da.date}</div> `;
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
  /deep/ .dlog_date_no_month { display: inline-block; font-size:8pt; border: solid 2px lightgrey; width:40px; height:50px;  }
 
}

</style>
