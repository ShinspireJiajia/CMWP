(function(){
  var mask=document.getElementById('payModal');
  var body=document.getElementById('payModalBody');
  function closeModal(){mask.classList.remove('show');}

  function renderProcessing(){
    body.innerHTML='<div class="mtxt proc"><span class="spinner"></span>付款處理中…</div>';
  }

  function renderError(){
    body.innerHTML=
      '<div class="mtxt err">付款失敗，請確認信用卡資訊後再試一次</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mRetry">重試</button><button class="mbtn cancel" id="mCancel">關閉</button></div>';
    document.getElementById('mRetry').addEventListener('click',runPayment);
    document.getElementById('mCancel').addEventListener('click',closeModal);
  }

  // 目前無真實後端，故 payOk 固定回傳成功；串接真實金流 API 時只要替換這裡的回傳值即可導向 ERROR 分支
  function callPaymentGateway(cb){setTimeout(function(){cb(true);},700);}

  function genPnr(){
    var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',pnr='';
    for(var i=0;i<6;i++){pnr+=chars.charAt(Math.floor(Math.random()*chars.length));}
    return pnr;
  }

  function runPayment(){
    renderProcessing();
    mask.classList.add('show');
    callPaymentGateway(function(payOk){
      if(!payOk){renderError();return;}
      sessionStorage.setItem('rdmPnr',genPnr());
      location.href='FE_12_兌換完成.html';
    });
  }

  document.getElementById('btnPay').addEventListener('click',runPayment);
})();
