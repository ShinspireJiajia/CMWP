(function(){
  var tb=document.querySelector('#cmsTable tbody');
  var btnAdd=document.getElementById('btnAdd');
  var pgCount=document.getElementById('pgCount');
  function updateCount(){
    if(!pgCount)return;
    var n=tb.querySelectorAll('tr').length;
    pgCount.textContent='筆，共 '+n+' 筆';
  }
  function toInput(td,w){var v=td.textContent;td.innerHTML='<input class="inp sm" style="width:'+w+'px" value="'+v.replace(/"/g,'&quot;')+'">';}
  function toText(td){var i=td.querySelector('input');td.textContent=i?i.value:td.textContent;}
  tb.addEventListener('click',function(e){
    var t=e.target,tr=t.closest&&t.closest('tr');if(!tr)return;
    var key=tr.querySelector('.mono'),zh=tr.querySelector('.c-zh'),en=tr.querySelector('.c-en'),act=tr.querySelector('.c-act'),lu=tr.querySelector('.lu');
    if(t.classList.contains('row-edit')){
      toInput(zh,160);toInput(en,200);
      act.innerHTML='<span class="lnk row-save">儲存</span><br><span class="lnk row-cancel" style="color:var(--color-state-error)">取消</span>';
    }else if(t.classList.contains('row-save')){
      if(tr.classList.contains('is-new')){
        var ki=key.querySelector('input');
        var kv=ki?ki.value.trim():'';
        if(!kv){ki&&ki.focus();return;}
        key.textContent=kv;
        tr.classList.remove('is-new');
      }
      toText(zh);toText(en);act.innerHTML='<span class="lnk row-edit">編輯</span>';if(lu)lu.innerHTML='王志明<br>2026/08/20 00:00';
    }else if(t.classList.contains('row-cancel')){
      if(tr.classList.contains('is-new')){
        tr.remove();
        updateCount();
        return;
      }
      toText(zh);toText(en);act.innerHTML='<span class="lnk row-edit">編輯</span>';
    }
  });
  if(btnAdd){
    btnAdd.addEventListener('click',function(){
      var tr=document.createElement('tr');
      tr.className='is-new';
      tr.innerHTML='<td class="mono"><input class="inp sm" style="width:160px" placeholder="_Key_"></td>'+
        '<td class="c-zh"><input class="inp sm" style="width:160px" placeholder="中文"></td>'+
        '<td class="c-en"><input class="inp sm" style="width:200px" placeholder="English"></td>'+
        '<td class="c-act"><span class="lnk row-save">儲存</span><br><span class="lnk row-cancel" style="color:var(--color-state-error)">取消</span></td>'+
        '<td class="muted lu">—</td>';
      tb.insertBefore(tr,tb.firstChild);
      updateCount();
      var first=tr.querySelector('input');
      if(first)first.focus();
    });
  }
})();
