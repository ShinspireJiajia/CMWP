(function(){
  var listView=document.getElementById('listView'),detailView=document.getElementById('detailView');
  var dets=document.querySelectorAll('.go-detail');
  for(var i=0;i<dets.length;i++){
    dets[i].addEventListener('click',function(){
      document.getElementById('d-date').textContent=this.getAttribute('data-date');
      document.getElementById('d-country').textContent=this.getAttribute('data-country');
      listView.style.display='none';detailView.style.display='';
    });
  }
  document.getElementById('backList').addEventListener('click',function(){
    detailView.style.display='none';listView.style.display='';
  });
  // 行內調整編輯
  var tb=document.querySelector('#setlTable tbody');
  tb.addEventListener('click',function(e){
    var t=e.target,tr=t.closest&&t.closest('tr');if(!tr)return;
    var adj=tr.querySelector('.adj-cell'),act=tr.querySelector('.act-cell'),lub=tr.querySelector('.lub');
    if(t.classList.contains('row-edit')){
      adj.innerHTML='<input class="inp" style="width:100px" value="">';
      act.innerHTML='<span class="lnk row-save">保存</span><br><span class="lnk row-cancel" style="color:var(--color-state-error)">取消</span>';
    }else if(t.classList.contains('row-save')){
      var v=adj.querySelector('input')?adj.querySelector('input').value:'';
      adj.textContent=v;adj.style.fontWeight='700';adj.style.color='var(--color-brand-dark)';
      act.innerHTML='<span class="lnk row-edit">編輯</span>';
      lub.innerHTML='王志明<br>2026/5/1 10:00';
    }else if(t.classList.contains('row-cancel')){
      adj.innerHTML='';adj.style.fontWeight='';adj.style.color='';
      act.innerHTML='<span class="lnk row-edit">編輯</span>';
    }
  });
})();
