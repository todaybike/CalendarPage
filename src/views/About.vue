<template>
  <div class="about">
    <h1>HCalendarPage</h1>
  <div class="content">
    HCalendar.ts 파일에 담겨 있는 클래스를 사용하면 된다.
    
    <h3>HDay</h3>
      <ul>
      <li> year : 년, <small>let d = HDay(); day.year=2019; a=day.year;</small></li>
      <li> month : 월, <small>0~11, day.month=10; a=day.month;</small></li>
      <li> date : 일, <small>day.date=10; a.day=day.date;</small></li>
      <li> kind : 종류, <small>1=평일, 0=일요일, 6=토툐일, 7=기념일, 8=이달아님</small> </li>
      </ul>
    <h3>HWeek</h3>
      <ul>
        <li>today: <small>let w = HWeek(); get w.today, set w.today;</small></li>
        <li>first: <small>get w.first;</small></li>
        <li>last: <small>get w.last;</small></li>
        <li>index: <small>get w.index(i);</small></li>
        <li>count: <small>get w.count;</small></li>
        <li>set: <small>w.set(2019,4,5);</small></li>
        <li>getWeek: <small>w.getWeek(2019,4,5);</small></li>
      </ul>
    <h3>HCalendarPage</h3>
    <ul>
        <li>today: <small>let c = HCalendarPage; get/set c.today</small></li>
        <li>year: <small>get/set c.year;</small></li>
        <li>month: <small>get/set w.month;</small></li>
        <li>date: <small>get/set w.date;</small></li>
        <li>start: <small>get/set w.start;</small></li>
        <li>end: <small>get/set w.end;</small></li>
        <li>now: <small>w.now();</small></li>
        <li>set: <small>w.set(2019.4.6);</small></li>
        <li>prev: 현재 월을 기준으로 이전 달 <small>w.prev();</small></li>
        <li>next: 현재 월을 기준으로 다음 달 <small>w.next();</small></li>
      </ul>

    
  </div>
  </div>
</template>

<style scoped>
.content  { text-align: left; }
</style>
