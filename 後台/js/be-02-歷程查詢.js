(function(){
  var LOGS={
    1:{sys:'ALMS',alcp:'JX0008422',pnr:'—',ip:'172.1.1.1',dt:'2026/04/01 17:01:43',status:'成功',ok:true,
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0008422",\n  "action": "queryMemberBalance"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "memberLevel": "Gold", "points": 128500 }\n}'},
    2:{sys:'ALMS',alcp:'JX0008422',pnr:'—',ip:'172.1.1.1',dt:'2026/04/01 17:05:25',status:'失敗',ok:false,err:'Error Code 404：查無對應會員資料',
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0008422",\n  "action": "queryMemberBalance"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 404,\n  "errorCode": "404",\n  "message": "查無對應會員資料"\n}'},
    3:{sys:'ARDW',alcp:'—',pnr:'6ABCD8',ip:'172.1.1.1',dt:'2026/04/01 17:06:56',status:'成功',ok:true,
      req:'{\n  "system": "ARDW",\n  "pnr": "6ABCD8",\n  "action": "checkRedeemEligibility"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "eligible": true, "cabin": "Economy" }\n}'},
    4:{sys:'ARDW',alcp:'—',pnr:'6ABCD8',ip:'172.1.1.1',dt:'2026/04/01 17:10:01',status:'失敗',ok:false,err:'Error Code 57721：訂位艙等不符兌換條件',
      req:'{\n  "system": "ARDW",\n  "pnr": "6ABCD8",\n  "action": "checkRedeemEligibility"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 400,\n  "errorCode": "57721",\n  "message": "訂位艙等不符兌換條件"\n}'},
    5:{sys:'ALMS',alcp:'JX0009103',pnr:'—',ip:'172.1.1.8',dt:'2026/04/02 09:22:10',status:'成功',ok:true,
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0009103",\n  "action": "queryMemberBalance"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "memberLevel": "Silver", "points": 42300 }\n}'},
    6:{sys:'JXMI',alcp:'—',pnr:'—',ip:'172.1.1.8',dt:'2026/04/02 09:24:55',status:'失敗',ok:false,err:'OTP 驗證逾時，請重新登入',
      req:'{\n  "system": "JXMI",\n  "action": "verifyOtp",\n  "sessionId": "sess_8823a1"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 408,\n  "errorCode": "OTP_TIMEOUT",\n  "message": "OTP 驗證逾時，請重新登入"\n}'},
    7:{sys:'ARDW',alcp:'—',pnr:'7FQK21',ip:'172.1.1.15',dt:'2026/04/02 11:38:02',status:'成功',ok:true,
      req:'{\n  "system": "ARDW",\n  "pnr": "7FQK21",\n  "action": "checkRedeemEligibility"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "eligible": true, "cabin": "Business" }\n}'},
    8:{sys:'ALMS',alcp:'JX0010256',pnr:'—',ip:'172.1.1.15',dt:'2026/04/02 14:52:47',status:'失敗',ok:false,err:'Error Code 500：會員系統暫時無法連線，請稍後再試',
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0010256",\n  "action": "queryMemberBalance"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 500,\n  "errorCode": "500",\n  "message": "會員系統暫時無法連線，請稍後再試"\n}'},
    9:{sys:'JXMI',alcp:'—',pnr:'—',ip:'172.1.1.20',dt:'2026/04/03 08:15:33',status:'成功',ok:true,
      req:'{\n  "system": "JXMI",\n  "action": "verifyOtp",\n  "sessionId": "sess_9f21c4"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "verified": true }\n}'},
    10:{sys:'ARDW',alcp:'—',pnr:'9KPX03',ip:'172.1.1.20',dt:'2026/04/03 08:20:11',status:'失敗',ok:false,err:'Error Code 57722：兌換張數超過本次可兌換上限，請重新確認航班艙等與張數',
      req:'{\n  "system": "ARDW",\n  "pnr": "9KPX03",\n  "action": "checkRedeemEligibility"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 400,\n  "errorCode": "57722",\n  "message": "兌換張數超過本次可兌換上限，請重新確認航班艙等與張數"\n}'},
    11:{sys:'ALMS',alcp:'JX0011009',pnr:'—',ip:'172.1.1.5',dt:'2026/04/03 16:47:29',status:'成功',ok:true,
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0011009",\n  "action": "queryMemberBalance"\n}',
      res:'{\n  "status": "SUCCESS",\n  "httpStatus": 200,\n  "data": { "memberLevel": "Gold", "points": 76100 }\n}'},
    12:{sys:'ALMS',alcp:'JX0011009',pnr:'—',ip:'172.1.1.5',dt:'2026/04/03 16:50:03',status:'失敗',ok:false,err:'Error Code 409：此會員帳號已存在有效兌換申請中，請稍候再試',
      req:'{\n  "system": "ALMS",\n  "alcpId": "JX0011009",\n  "action": "submitRedeem"\n}',
      res:'{\n  "status": "FAIL",\n  "httpStatus": 409,\n  "errorCode": "409",\n  "message": "此會員帳號已存在有效兌換申請中，請稍候再試"\n}'}
  };

  // 查看明細
  var modal=document.getElementById('detailModal');
  function fillDetail(id){
    var d=LOGS[id];if(!d)return;
    document.getElementById('d-sys').textContent=d.sys;
    document.getElementById('d-alcp').textContent=d.alcp;
    document.getElementById('d-pnr').textContent=d.pnr;
    document.getElementById('d-ip').textContent=d.ip;
    document.getElementById('d-datetime').textContent=d.dt;
    document.getElementById('d-status').innerHTML='<span class="pill '+(d.ok?'success':'error')+'">'+d.status+'</span>';
    var errWrap=document.getElementById('d-err-wrap');
    if(d.ok){errWrap.style.display='none';}
    else{errWrap.style.display='';document.getElementById('d-err').textContent=d.err;}
    document.getElementById('d-req').textContent=d.req;
    document.getElementById('d-res').textContent=d.res;
  }
  function closeModal(){modal.classList.remove('show');}
  var links=document.querySelectorAll('.view-detail');
  for(var i=0;i<links.length;i++){
    links[i].addEventListener('click',function(){
      fillDetail(this.getAttribute('data-id'));
      modal.classList.add('show');
    });
  }
  document.getElementById('detailClose').addEventListener('click',closeModal);
  document.getElementById('detailClose2').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

  // 進階條件：展開／收合
  var advToggle=document.getElementById('advToggle');
  var advBox=document.getElementById('filtersAdv');
  if(advToggle&&advBox){
    advToggle.addEventListener('click',function(){
      var willOpen=advBox.hasAttribute('hidden');
      if(willOpen){advBox.removeAttribute('hidden');}
      else{advBox.setAttribute('hidden','');}
      this.classList.toggle('is-open',willOpen);
      this.querySelector('.txt').textContent=willOpen?'收合進階條件':'進階條件';
    });
  }

  // 重置查詢條件
  var resetBtn=document.getElementById('btnReset');
  if(resetBtn){
    resetBtn.addEventListener('click',function(){
      var els=document.querySelectorAll('.hist-filters .inp');
      for(var i=0;i<els.length;i++){
        if(els[i].tagName==='SELECT'){els[i].selectedIndex=0;}
        else{els[i].value='';}
      }
    });
  }

  // 欄位排序（日期／時間）
  var tbody=document.querySelector('table tbody');
  var headers=document.querySelectorAll('th.sortable');
  for(var h=0;h<headers.length;h++){
    headers[h].addEventListener('click',function(){
      var idx=this.cellIndex;
      var asc=this.getAttribute('data-dir')!=='asc';
      for(var j=0;j<headers.length;j++){headers[j].removeAttribute('data-dir');headers[j].querySelector('.caret').textContent='↕';}
      this.setAttribute('data-dir',asc?'asc':'desc');
      this.querySelector('.caret').textContent=asc?'▲':'▼';
      var rows=Array.prototype.slice.call(tbody.querySelectorAll('tr'));
      rows.sort(function(a,b){
        var av=a.cells[idx].textContent.trim(),bv=b.cells[idx].textContent.trim();
        if(av<bv)return asc?-1:1;
        if(av>bv)return asc?1:-1;
        return 0;
      });
      for(var k=0;k<rows.length;k++){tbody.appendChild(rows[k]);}
    });
  }
})();
