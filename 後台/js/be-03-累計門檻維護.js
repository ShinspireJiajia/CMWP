(function(){
  var listView=document.getElementById('listView'),editView=document.getElementById('editView');
  var editModeLabel=document.getElementById('editModeLabel');
  var formFields=['e-ver','e-eff','e-exp','e-country','e-cur','e-freq','e-type'];

  function setReadonly(readonly){
    editView.classList.toggle('is-readonly',readonly);
    editModeLabel.textContent=readonly?'檢視版本 View Version：':'編輯版本 Edit Version：';
    for(var i=0;i<formFields.length;i++){
      var el=document.getElementById(formFields[i]);
      if(el){ if('value' in el){el.disabled=readonly;} }
    }
    var thrInputs=document.querySelectorAll('#thrTable tbody input');
    for(var j=0;j<thrInputs.length;j++){thrInputs[j].disabled=readonly;}
  }

  function openEdit(el,readonly){
    document.getElementById('e-ver').value=el.getAttribute('data-ver');
    document.getElementById('e-country').value=el.getAttribute('data-country');
    document.getElementById('e-cur').value=el.getAttribute('data-cur');
    document.getElementById('e-eff').value=el.getAttribute('data-eff');
    document.getElementById('e-exp').value=el.getAttribute('data-exp');
    document.getElementById('editVer').textContent=el.getAttribute('data-ver');
    setReadonly(readonly);
    listView.style.display='none';editView.style.display='';
  }

  var views=document.querySelectorAll('.go-view');
  for(var i=0;i<views.length;i++){
    views[i].addEventListener('click',function(){openEdit(this,true);});
  }
  var edits=document.querySelectorAll('.go-edit');
  for(var k=0;k<edits.length;k++){
    edits[k].addEventListener('click',function(){openEdit(this,false);});
  }
  document.getElementById('backList').addEventListener('click',function(){
    editView.style.display='none';listView.style.display='';
  });
  // 累計門檻：新增／刪除列
  var tbody=document.querySelector('#thrTable tbody');
  document.getElementById('addRow').addEventListener('click',function(){
    var tr=document.createElement('tr');
    tr.innerHTML='<td><input class="inp" style="width:100%" value=""></td><td><input class="inp" style="width:100%" value=""></td><td class="thr-act" style="text-align:center"><span class="lnk del-row" style="color:var(--color-state-error)">刪除</span></td>';
    tbody.appendChild(tr);
  });
  tbody.addEventListener('click',function(e){
    if(e.target.classList.contains('del-row')){
      var tr=e.target.closest('tr');if(tr)tr.parentNode.removeChild(tr);
    }
  });
})();
