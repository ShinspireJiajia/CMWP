// 申請入會同意頁：勾選「已閱讀並同意隱私保護政策」後才能點擊「下一頁」
(function(){
  var chk = document.getElementById('agreeChk');
  var btnNext = document.getElementById('btnNext');

  function syncBtnState(){
    if(chk.checked){
      btnNext.classList.remove('is-disabled');
      btnNext.setAttribute('aria-disabled','false');
    }else{
      btnNext.classList.add('is-disabled');
      btnNext.setAttribute('aria-disabled','true');
    }
  }

  chk.addEventListener('change', syncBtnState);

  btnNext.addEventListener('click', function(e){
    if(!chk.checked){
      e.preventDefault();
    }
  });

  syncBtnState();
})();
