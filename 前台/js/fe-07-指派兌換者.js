(function(){
  // 員工名單資料：與「員工名單維護」頁面（FE_09）連動，指派時直接拉取，避免會員手動輸入會員號碼出錯
  var EMPLOYEES=[
    {id:'E900014361',name:'CHEN,XXXXUN',title:'先生',last:'CHEN',first:'CHUN-YU',birth:'1985年3月12日',email:'e900014361@shinda.com.tw'},
    {id:'E900014462',name:'WANG,XXXXG',title:'小姐',last:'WANG',first:'MEI-LING',birth:'1990年7月5日',email:'e900014462@shinda.com.tw'},
    {id:'E900014503',name:'LIN,XXXXA',title:'先生',last:'LIN',first:'CHIA-HUA',birth:'1988年11月23日',email:'e900014503@shinda.com.tw'},
    {id:'E900014577',name:'HSU,XXXXN',title:'小姐',last:'HSU',first:'YU-SHAN',birth:'1992年2月17日',email:'e900014577@shinda.com.tw'},
    {id:'E900014620',name:'YEH,XXXXI',title:'先生',last:'YEH',first:'CHIH-WEI',birth:'1983年9月30日',email:'e900014620@shinda.com.tw'}
  ];

  // PNR 查無會員號碼者，指派前須先呼叫模擬 API 取得旅客個資供確認
  function callAlcpPnrPassenger(pnr,cb){
    setTimeout(function(){cb(true,{title:'先生',last:'CHANG',first:'WEI-TING',birth:'1979年6月8日',email:'traveldesk@shinda.com.tw'});},400);
  }

  // 兌換券清單：status 僅 ACTIVE / USED / EXPIRE 三種，type 決定「前往指派」導向的兌換頁
  var VOUCHERS=[
    {id:'V1',type:'upgrade',cat:'升等券',desc:'亞洲區間 兩艙等機型 經濟艙升等商務艙',expire:'2027/01/31',status:'USED',pts:3000},
    {id:'V2',type:'upgrade',cat:'升等券',desc:'美洲/歐洲區間 四艙等機型 經濟艙升等商務艙',expire:'2027/01/31',status:'USED',pts:5000},
    {id:'V3',type:'upgrade',cat:'升等券',desc:'美洲/歐洲區間 四艙等機型 經濟艙升等豪華經濟艙',expire:'2027/01/31',status:'ACTIVE',pts:4000},
    {id:'V4',type:'flight',cat:'酬賓機票',desc:'亞洲不限航點 經濟艙機票',expire:'2027/03/15',status:'ACTIVE',pts:28000},
    {id:'V5',type:'lounge',cat:'貴賓加值禮遇',desc:'貴賓室／專屬報到櫃台／行李優先',expire:'2026/12/31',status:'ACTIVE',pts:800},
    {id:'V6',type:'lounge',cat:'貴賓加值禮遇',desc:'機場貴賓室 / 專屬報到櫃台',expire:'2026/12/31',status:'EXPIRE',pts:800}
  ];

  function findVoucher(id){
    for(var i=0;i<VOUCHERS.length;i++){if(VOUCHERS[i].id===id)return VOUCHERS[i];}
    return null;
  }

  var listView=document.getElementById('listView');
  var assignView=document.getElementById('assignView');
  var asgBody=document.getElementById('asgBody');
  var pagination=document.getElementById('pagination');

  // 狀態顯示規則：
  // ACTIVE　→ SETTING=前往指派（可點）／STATUS=未使用（不可點）／CANCEL=歸還（可點）
  // USED　 → SETTING=指派完成／STATUS=已使用／CANCEL 反灰不可點；非 ACTIVE 整列反灰
  // EXPIRE → SETTING=未指派／STATUS=已過期／CANCEL 反灰不可點；非 ACTIVE 整列反灰
  var pager=FePager(pagination,{
    getList:function(){return VOUCHERS;},
    renderRows:function(pageItems){
      asgBody.innerHTML=pageItems.map(function(v){
        var settingHtml,statusHtml,cancelHtml;
        if(v.status==='ACTIVE'){
          settingHtml='<span class="pill brand asg-setting" data-id="'+v.id+'" style="cursor:pointer">前往指派</span>';
          statusHtml='<span class="pill mut">未使用</span>';
          cancelHtml='<span class="asg-cancel" data-id="'+v.id+'" style="color:#C1585A;font-weight:600;cursor:pointer">歸還</span>';
        }else if(v.status==='USED'){
          settingHtml='<span class="muted">指派完成</span>';
          statusHtml='<span class="pill mut">已使用</span>';
          cancelHtml='<span class="muted">—</span>';
        }else{
          settingHtml='<span class="muted">未指派</span>';
          statusHtml='<span class="pill mut">已過期</span>';
          cancelHtml='<span class="muted">—</span>';
        }
        var rowCls=v.status==='ACTIVE'?'':' class="row-dim"';
        return '<tr'+rowCls+'><td><span class="pill mut">'+v.cat+'</span></td><td>'+v.desc+'</td><td class="muted">'+v.expire+'</td>'+
          '<td>'+settingHtml+'</td><td>'+statusHtml+'</td><td>'+cancelHtml+'</td></tr>';
      }).join('');
    }
  });
  function renderRows(){pager.render();}

  pager.render();

  // 指派面板：下拉選單選項直接來自員工名單（FE_09），另保留 PNR 欄位供無會員號碼者查詢
  var assignTitle=document.getElementById('assignTitle');
  var selEmployee=document.getElementById('selEmployee');
  selEmployee.innerHTML='<option value="">請選擇</option>'+EMPLOYEES.map(function(e){
    return '<option value="'+e.id+'">'+e.id+'　'+e.name+'</option>';
  }).join('');
  var inpPnr=document.getElementById('inpPnr');
  var assignWarn=document.getElementById('assignWarn');
  var currentVoucher=null;

  function showListView(){assignView.style.display='none';listView.style.display='';}
  function showAssignView(v){
    currentVoucher=v;
    assignTitle.textContent='指派兌換者：'+v.cat+'／'+v.desc;
    selEmployee.value='';
    inpPnr.value='';
    assignWarn.style.display='none';
    listView.style.display='none';
    assignView.style.display='';
  }

  document.getElementById('btnAssignBack').addEventListener('click',showListView);

  document.getElementById('btnAssignSearch').addEventListener('click',function(){
    var empId=selEmployee.value;
    var pnr=inpPnr.value.trim();
    if(!empId&&!pnr){assignWarn.style.display='';return;}
    assignWarn.style.display='none';
    var emp=empId?EMPLOYEES.filter(function(e){return e.id===empId;})[0]:null;
    var target=emp?(emp.id+'　'+emp.name):('PNR '+pnr);
    var voucher=currentVoucher;
    if(emp){
      openPersonalConfirm(voucher,target,emp);
    }else{
      callAlcpPnrPassenger(pnr,function(ok,person){
        if(!ok)return;
        openPersonalConfirm(voucher,target,person);
      });
    }
  });

  // 確認個人資料：無論以員工號碼或 PNR 指派，指派前皆須讓使用者勾選同意並確認資料無誤
  var pdModal=document.getElementById('pdModal');
  var pdList=document.getElementById('pdList');
  var pdAgree=document.getElementById('pdAgree');
  var pdConfirm=document.getElementById('pdConfirm');
  var pdClose=document.getElementById('pdClose');

  function closePdModal(){pdModal.classList.remove('show');}
  function openPersonalConfirm(v,target,person){
    pdList.innerHTML=
      '<div class="pd-idx">1. 成人</div>'+
      '<div class="pd-name">'+person.last+' '+person.first+'</div>'+
      '<div class="pd-grid">'+
        '<div class="f"><div class="pd-f-lbl">稱謂</div><div class="pd-f-val">'+person.title+'</div></div>'+
        '<div class="f"><div class="pd-f-lbl">姓氏</div><div class="pd-f-val">'+person.last+'</div></div>'+
        '<div class="f"><div class="pd-f-lbl">名字</div><div class="pd-f-val">'+person.first+'</div></div>'+
        '<div class="f"><div class="pd-f-lbl">出生日期</div><div class="pd-f-val">'+person.birth+'</div></div>'+
      '</div>'+
      '<div class="pd-f-lbl">電子郵件</div><div class="pd-f-val">'+person.email+'</div>';
    pdAgree.checked=false;
    pdConfirm.disabled=true;
    pdConfirm.onclick=function(){closePdModal();openAssignConfirm(v,target);};
    pdModal.classList.add('show');
  }
  pdAgree.addEventListener('change',function(){pdConfirm.disabled=!pdAgree.checked;});
  pdClose.addEventListener('click',closePdModal);
  pdModal.addEventListener('click',function(e){if(e.target===pdModal)closePdModal();});

  // 指派 / 歸還共用的浮層
  var mask=document.getElementById('asgModal');
  var mbody=document.getElementById('asgModalBody');
  function closeModal(){mask.classList.remove('show');}
  function openModal(){mask.classList.add('show');}
  function renderProcessing(step){mbody.innerHTML='<div class="mtxt proc"><span class="spinner"></span>'+step+'</div>';}

  // 指派兌換者：判斷兌換券種類進入對應兌換頁；酬賓機票需另行完成航班／旅客資料，故導向搜尋航班頁
  function openAssignConfirm(v,target){
    mbody.innerHTML=
      '<div class="mtxt">確定指派<b>'+v.cat+'／'+v.desc+'</b>給<b>'+target+'</b>？</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',function(){runAssign(v,target);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
    openModal();
  }

  function callAlcpAssignVoucher(v,target,cb){setTimeout(function(){cb(true);},600);}

  function runAssign(v,target){
    renderProcessing('Call ALCP（assignVoucher）指派兌換者…');
    callAlcpAssignVoucher(v,target,function(ok){
      if(!ok){renderAssignError(v,target);return;}
      if(v.type==='flight'){
        sessionStorage.setItem('rdmItemName',v.desc);
        sessionStorage.setItem('asgTarget',target);
        location.href='FE_08_搜尋航班.html';
        return;
      }
      v.status='USED';
      renderRows();
      mbody.innerHTML=
        '<div class="mtxt ok-icon">✓</div>'+
        '<div class="mtxt">完成指派！已將<b>'+v.desc+'</b>指派給<b>'+target+'</b></div>'+
        '<div class="mbtns"><button class="mbtn ok" id="mHome">回首頁</button></div>';
      document.getElementById('mHome').addEventListener('click',function(){closeModal();showListView();});
    });
  }

  function renderAssignError(v,target){
    mbody.innerHTML=
      '<div class="mtxt err">指派失敗，請稍後再試一次</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mRetry">重試</button><button class="mbtn cancel" id="mCancel">關閉</button></div>';
    document.getElementById('mRetry').addEventListener('click',function(){openAssignConfirm(v,target);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  // 歸還：先呼叫 refundVoucher/dryRun 顯示可歸還點數，確認後再呼叫 refundVoucher 完成退還
  function callAlcpRefundDryRun(v,cb){setTimeout(function(){cb(true,v.pts);},500);}
  function callAlcpRefundVoucher(v,cb){setTimeout(function(){cb(true);},700);}

  function openReturnDryRun(v){
    openModal();
    renderProcessing('Call ALCP（refundVoucher/dryRun）查詢可歸還點數…');
    callAlcpRefundDryRun(v,function(ok,pts){
      if(!ok){renderReturnError(v);return;}
      renderReturnConfirm(v,pts);
    });
  }

  function renderReturnConfirm(v,pts){
    mbody.innerHTML=
      '<div class="mtxt">確定歸還<b>'+v.cat+'／'+v.desc+'</b>？</div>'+
      '<div class="mtxt" style="margin-top:-20px">可退還共 '+pts+' 點</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',function(){runReturn(v,pts);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  function runReturn(v,pts){
    renderProcessing('Call ALCP（refundVoucher）歸還兌換券…');
    callAlcpRefundVoucher(v,function(ok){
      if(!ok){renderReturnError(v);return;}
      VOUCHERS=VOUCHERS.filter(function(x){return x.id!==v.id;});
      renderRows();
      mbody.innerHTML=
        '<div class="mtxt ok-icon">✓</div>'+
        '<div class="mtxt">完成歸還！已退還 '+pts+' 點</div>'+
        '<div class="mbtns"><button class="mbtn ok" id="mHome">回首頁</button></div>';
      document.getElementById('mHome').addEventListener('click',closeModal);
    });
  }

  function renderReturnError(v){
    mbody.innerHTML=
      '<div class="mtxt err">歸還失敗，請稍後再試一次</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mRetry">重試</button><button class="mbtn cancel" id="mCancel">關閉</button></div>';
    document.getElementById('mRetry').addEventListener('click',function(){openReturnDryRun(v);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  asgBody.addEventListener('click',function(e){
    var set=e.target.closest&&e.target.closest('.asg-setting');
    if(set){showAssignView(findVoucher(set.getAttribute('data-id')));return;}
    var can=e.target.closest&&e.target.closest('.asg-cancel');
    if(can){openReturnDryRun(findVoucher(can.getAttribute('data-id')));}
  });

  mask.addEventListener('click',function(e){if(e.target===mask)closeModal();});
})();
