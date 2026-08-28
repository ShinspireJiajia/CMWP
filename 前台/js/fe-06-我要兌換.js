(function(){
  var views={0:'v-air',1:'v-up',2:'v-lounge'};
  var segs=document.querySelectorAll('.seg span');
  for(var i=0;i<segs.length;i++){(function(idx){
    segs[idx].addEventListener('click',function(){
      for(var j=0;j<segs.length;j++){segs[j].classList.remove('is-selected');}
      segs[idx].classList.add('is-selected');
      for(var k in views){document.getElementById(views[k]).style.display=(k==idx?'':'none');}
    });
  })(i);}
  var utabs=document.querySelectorAll('.utab');
  for(var u=0;u<utabs.length;u++){(function(t){
    t.addEventListener('click',function(){
      for(var v=0;v<utabs.length;v++){utabs[v].classList.remove('is-current');}
      t.classList.add('is-current');
      document.getElementById('u-asia').style.display=(t.getAttribute('data-up')=='u-asia'?'':'none');
      document.getElementById('u-amer').style.display=(t.getAttribute('data-up')=='u-amer'?'':'none');
    });
  })(utabs[u]);}

  // 兌換確認流程：依 data-mode 分成兩條動線
  // flight  = 酬賓機票，確認後導向搜尋航班頁面
  // instant = 升等機位／機場禮遇，確認後直接呼叫會員管理系統／訂位票務系統（此為靜態頁面，故以模擬處理取代真實 API）
  var mask=document.getElementById('redeemModal');
  var body=document.getElementById('modalBody');

  function closeModal(){mask.classList.remove('show');}

  function renderConfirmFlight(name,href){
    body.innerHTML=
      '<div class="mtxt">確定兌換<b>'+name+'</b>，前往選擇航班？</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',function(){sessionStorage.setItem('rdmItemName',name);location.href=href;});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  function renderConfirmInstant(name,pts){
    body.innerHTML=
      '<div class="mtxt">確定兌換<b>'+name+'</b>並將扣除 '+pts+' 點數？</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',function(){runInstantRedeem(name,pts);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  function renderProcessing(step){
    body.innerHTML=
      '<div class="mtxt proc"><span class="spinner"></span>'+step+'</div>';
  }

  function renderError(name,pts){
    body.innerHTML=
      '<div class="mtxt err">兌換失敗，請稍後再試一次</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mRetry">重試</button><button class="mbtn cancel" id="mCancel">關閉</button></div>';
    document.getElementById('mRetry').addEventListener('click',function(){renderConfirmInstant(name,pts);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  function renderSuccess(code){
    body.innerHTML=
      '<div class="mtxt ok-icon">✓</div>'+
      '<div class="mtxt">完成兌換！對獎號碼：<b>'+code+'</b></div>'+
      '<div class="mbtns"><a class="mbtn ok" href="FE_07_指派兌換者.html" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none">前往指派兌換者</a><button class="mbtn cancel" id="mClose">關閉</button></div>';
    document.getElementById('mClose').addEventListener('click',closeModal);
  }

  // 依序模擬：Call API(會員管理系統) postCarts → 取得對獎號碼 → Call Webservice(訂位票務系統) 貼回ARDW PNR
  // 目前無真實後端，故 apiOk 固定回傳成功；串接真實 API 時只要替換這裡的回傳值即可導向 ERROR 分支
  function callApiPostCarts(cb){setTimeout(function(){cb(true);},500);}
  function callWebserviceArdwPnr(cb){setTimeout(function(){cb(true);},600);}

  function runInstantRedeem(name,pts){
    renderProcessing('Call API（會員管理系統）postCarts…');
    callApiPostCarts(function(apiOk){
      if(!apiOk){renderError(name,pts);return;}
      renderProcessing('取得對獎號碼…');
      setTimeout(function(){
        renderProcessing('Call Webservice（訂位票務系統）貼回 ARDW PNR…');
        callWebserviceArdwPnr(function(pnrOk){
          if(!pnrOk){renderError(name,pts);return;}
          var code='ARDW'+Math.floor(100000+Math.random()*900000);
          renderSuccess(code);
        });
      },500);
    });
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.redeem');
    if(!b)return;
    var name=b.getAttribute('data-name')||'';
    var pts=b.getAttribute('data-pts')||'○○○';
    var mode=b.getAttribute('data-mode')||'instant';
    if(mode==='flight'){
      renderConfirmFlight(name,b.getAttribute('data-href'));
    }else{
      renderConfirmInstant(name,pts);
    }
    mask.classList.add('show');
  });
  mask.addEventListener('click',function(e){if(e.target===mask)closeModal();});
})();
