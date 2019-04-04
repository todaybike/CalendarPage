<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="cpage">
    <button v-on:click="cpage1()">현재 월에 해당하는 페이지 가져오기</button><br>
    <button v-on:click="cpage2()">다음 달 가져오기</button><br>
    <button v-on:click="cpage3()">이전 달 가져오기</button>
    <hr>
    <div class="log"><pre>{{ logs1 }}</pre></div>
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
      <option value=00>00</option>
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
    <div class="log"><pre>{{ logs2 }}</pre></div>
    </div>
  </div>

  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { HCalendarPage, HWeek } from './HCalendar';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  page = new HCalendarPage();
  logs1 : string = '';
  logs2 : string = '';
  wyear : string = '2019';
  wmonth : string = '03';
  wday : string = '05';

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
    let week = new HWeek();
    week.set( parseInt(this.wyear), parseInt(this.wmonth), parseInt(this.wday) );
    this.log2( week.toString() );
  }

  public log1( line: string ) {
    // console.log( line );
    let aline = line.replace(/ /g, '');
    let bline = aline.replace(/>/g, '>\n');
    this.logs1 = bline.replace(/\,/g, '\n');
  }

  public log2( line: string ) {
    // console.log( line );
    let aline = line.replace(/ /g, '');
    let bline = aline.replace(/>/g, '>\n');
    this.logs2 = bline.replace(/\,/g, '\n');
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
</style>
