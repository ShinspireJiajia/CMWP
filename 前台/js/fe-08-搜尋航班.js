(function(){
  var step1=document.getElementById('step1');
  var step2=document.getElementById('step2');
  var summary=document.getElementById('flightSummary');

  // 標題顯示由「我要兌換」頁帶入的選定品項（例：香港及澳門航點經濟艙 → 香港及澳門航點 經濟艙乙張）
  var rdmItemTitle=document.getElementById('rdmItemTitle');
  var rdmItemName=sessionStorage.getItem('rdmItemName');
  if(rdmItemName){
    rdmItemTitle.textContent=rdmItemName.indexOf('航點')!==-1?rdmItemName.replace('航點','航點 ')+'乙張':rdmItemName;
    rdmItemTitle.style.display='';
  }

  // 出發地／目的地連動：台北／台中 ⇄ 香港／澳門（僅此兩組互為對方的可選航點）
  var CITY={TPE:'台北 TPE',RMQ:'台中 RMQ',HKG:'香港 HKG',MFM:'澳門 MFM'};
  var GROUP_A=['TPE','RMQ'];
  var GROUP_B=['HKG','MFM'];
  function opposite(code){return GROUP_A.indexOf(code)!==-1?GROUP_B:GROUP_A;}
  function cityName(code){return CITY[code].split(' ')[0];}

  var selOrigin=document.getElementById('selOrigin');
  var selDest=document.getElementById('selDest');

  function renderDest(prevValue){
    var opts=opposite(selOrigin.value);
    selDest.innerHTML=opts.map(function(code){return '<option value="'+code+'">'+CITY[code]+'</option>';}).join('');
    selDest.value=(opts.indexOf(prevValue)!==-1)?prevValue:opts[0];
  }
  renderDest(selDest.value||'HKG');
  selOrigin.addEventListener('change',function(){renderDest(selDest.value);});

  // 出發／回程日期：限拉取來回，回程需晚於出發
  var depDate=document.getElementById('depDate');
  var retDate=document.getElementById('retDate');
  var dateWarn=document.getElementById('dateWarn');
  function datesValid(){return retDate.value && depDate.value && retDate.value>depDate.value;}

  // 週曆選日 + 航班卡片
  var dstripDays=document.getElementById('dstripDays');
  var fltList=document.getElementById('fltList');
  var noFlightHint=document.getElementById('noFlightHint');
  var btnPrevWeek=document.getElementById('btnPrevWeek');
  var btnNextWeek=document.getElementById('btnNextWeek');
  var WEEKDAY=['週日','週一','週二','週三','週四','週五','週六'];
  var FLIGHTS=[
    {no:'JX 222',dep:'08:30',arr:'11:05',dur:'2小時35分'},
    {no:'JX 226',dep:'13:15',arr:'15:50',dur:'2小時35分'},
    {no:'JX 228',dep:'18:40',arr:'21:15',dur:'2小時35分'}
  ];

  function pad(n){return n<10?'0'+n:''+n;}
  function isoOf(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function parseIso(str){var p=str.split('-');return new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));}
  function dateLabel(d){return (d.getMonth()+1)+'月'+d.getDate()+'日';}
  // 示範用可否兌換規則：每月 5 的倍數日視為額滿無航班（無真實後端）
  function isAvailable(d){return d.getDate()%5!==0;}

  var centerDate=null, selectedIso=null;

  function renderStrip(){
    dstripDays.innerHTML='';
    var start=new Date(centerDate);start.setDate(centerDate.getDate()-3);
    for(var i=0;i<7;i++){
      var d=new Date(start);d.setDate(start.getDate()+i);
      var iso=isoOf(d);
      var avail=isAvailable(d);
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='dday'+(iso===selectedIso?' is-selected':'');
      btn.setAttribute('data-iso',iso);
      btn.innerHTML='<span class="dnum">'+(d.getMonth()+1)+'/'+pad(d.getDate())+'</span><span class="dwk">'+WEEKDAY[d.getDay()]+'</span><span class="dstatus '+(avail?'avail':'unavail')+'">'+(avail?'有航班':'無航班')+'</span>';
      btn.addEventListener('click',function(){selectDate(this.getAttribute('data-iso'));});
      dstripDays.appendChild(btn);
    }
  }

  function renderFlights(d){
    var originName=cityName(selOrigin.value), destName=cityName(selDest.value);
    var lbl=dateLabel(d);
    fltList.innerHTML=FLIGHTS.map(function(f){
      return '<div class="flt-card">'+
        '<div class="fc-head"><span class="fc-no">'+f.no+'</span><span class="fc-dur">飛行時間 '+f.dur+'</span></div>'+
        '<div class="fc-body">'+
          '<div class="fc-pt"><span class="fc-date">'+lbl+'</span><span class="fc-time">'+f.dep+'</span><span class="fc-code">'+selOrigin.value+' '+originName+'</span></div>'+
          '<div class="fc-mid"><span class="fc-plane">✈</span></div>'+
          '<div class="fc-pt fc-pt-end"><span class="fc-date">'+lbl+'</span><span class="fc-time">'+f.arr+'</span><span class="fc-code">'+selDest.value+' '+destName+'</span></div>'+
        '</div>'+
        '<div class="fc-foot"><span class="pill brand">經濟艙</span><button class="btn-dark choose-flight" data-flight="'+f.no+'" data-dep="'+selOrigin.value+' '+originName+' '+f.dep+'" data-arr="'+selDest.value+' '+destName+' '+f.arr+'" data-dur="'+f.dur+'" data-cabin="經濟艙">選擇</button></div>'+
      '</div>';
    }).join('');
  }

  function selectDate(iso){
    selectedIso=iso;
    renderStrip();
    var d=parseIso(iso);
    if(isAvailable(d)){
      fltList.style.display='';
      noFlightHint.style.display='none';
      renderFlights(d);
    }else{
      fltList.style.display='none';
      fltList.innerHTML='';
      noFlightHint.style.display='';
    }
  }

  btnPrevWeek.addEventListener('click',function(){centerDate.setDate(centerDate.getDate()-7);renderStrip();});
  btnNextWeek.addEventListener('click',function(){centerDate.setDate(centerDate.getDate()+7);renderStrip();});

  var searchHint=document.getElementById('searchHint');
  var resultsCard=document.getElementById('resultsCard');
  document.getElementById('btnSearch').addEventListener('click',function(){
    if(!datesValid()){dateWarn.style.display='';resultsCard.style.display='none';searchHint.style.display='';return;}
    dateWarn.style.display='none';
    searchHint.style.display='none';
    resultsCard.style.display='';
    centerDate=parseIso(depDate.value);
    selectDate(isoOf(centerDate));
  });

  // Step1「選擇」→ 帶入航班摘要，切換到 Step2 填寫旅客資料
  fltList.addEventListener('click',function(e){
    var btn=e.target.closest?e.target.closest('.choose-flight'):null;
    if(!btn)return;
    summary.innerHTML=
      '<b style="color:var(--color-brand-dark)">'+btn.getAttribute('data-flight')+'</b>　'+
      btn.getAttribute('data-dep')+' → '+btn.getAttribute('data-arr')+
      '　'+btn.getAttribute('data-dur')+
      '　<span class="pill brand">'+btn.getAttribute('data-cabin')+'</span>';
    step1.style.display='none';
    step2.style.display='';
  });

  document.getElementById('btnBack').addEventListener('click',function(){
    step2.style.display='none';
    step1.style.display='';
  });

  // 確認兌換點選 → Call Webservice(訂位票務系統) 機位訂位
  var mask=document.getElementById('bookModal');
  var body=document.getElementById('bookModalBody');
  function closeModal(){mask.classList.remove('show');}

  function renderConfirm(){
    body.innerHTML=
      '<div class="mtxt">確認送出訂位資料，進行機位預訂？</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',runBooking);
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  function renderProcessing(){
    body.innerHTML='<div class="mtxt proc"><span class="spinner"></span>Call Webservice（訂位票務系統）機位訂位…</div>';
  }

  function renderError(){
    body.innerHTML=
      '<div class="mtxt err">機位預訂失敗，請重新確認</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mRetry">重試</button><button class="mbtn cancel" id="mCancel">關閉</button></div>';
    document.getElementById('mRetry').addEventListener('click',renderConfirm);
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  // 目前無真實後端，故 bookingOk 固定回傳成功；串接真實 API 時只要替換這裡的回傳值即可導向 ERROR 分支（重試會回到「確認兌換點選」步驟）
  function callSeatBooking(cb){setTimeout(function(){cb(true);},700);}

  function runBooking(){
    renderProcessing();
    callSeatBooking(function(bookingOk){
      if(!bookingOk){renderError();return;}
      location.href='FE_11_信用卡付款.html';
    });
  }

  document.getElementById('btnConfirmBooking').addEventListener('click',function(){
    renderConfirm();
    mask.classList.add('show');
  });
  mask.addEventListener('click',function(e){if(e.target===mask)closeModal();});
})();
