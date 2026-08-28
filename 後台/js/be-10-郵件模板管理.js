(function(){
  var tbody=document.querySelector('#tplTable tbody');
  var modal=document.getElementById('tplModal');
  var fName=document.getElementById('f-name'),
      fSubject=document.getElementById('f-subject'),
      fContent=document.getElementById('f-content'),
      fVars=document.getElementById('f-vars'),
      fLastUpdate=document.getElementById('f-lastupdate');
  var btnEdit=document.getElementById('tplModalEdit'),
      btnSave=document.getElementById('tplModalSave'),
      btnCancel=document.getElementById('tplModalCancel'),
      btnCloseBtn=document.getElementById('tplModalCloseBtn');
  var editingRow=null;

  function setMode(editing){
    fSubject.readOnly=!editing;
    fContent.readOnly=!editing;
    btnEdit.style.display=editing?'none':'';
    btnCloseBtn.style.display=editing?'none':'';
    btnSave.style.display=editing?'':'none';
    btnCancel.style.display=editing?'':'none';
    document.getElementById('tplModalTitle').textContent=(editing?'編輯':'檢視')+'：'+fName.value;
  }
  function openModal(tr,editing){
    editingRow=tr;
    fName.value=tr.cells[0].textContent.trim();
    fSubject.value=tr.getAttribute('data-subject')||'';
    fContent.value=tr.getAttribute('data-content')||'';
    fVars.textContent=tr.getAttribute('data-vars')||'';
    fLastUpdate.textContent=tr.cells[1].textContent.trim()+'　'+tr.cells[2].textContent.trim();
    setMode(!!editing);
    modal.classList.add('show');
  }
  function closeModal(){modal.classList.remove('show');editingRow=null;}

  tbody.addEventListener('click',function(e){
    var t=e.target,tr=t.closest&&t.closest('tr');if(!tr)return;
    if(t.classList.contains('row-view'))openModal(tr,false);
    else if(t.classList.contains('row-edit'))openModal(tr,true);
  });

  btnEdit.addEventListener('click',function(){setMode(true);fSubject.focus();});
  btnCancel.addEventListener('click',function(){openModal(editingRow,false);});
  btnCloseBtn.addEventListener('click',closeModal);
  document.getElementById('tplModalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('show'))closeModal();});

  btnSave.addEventListener('click',function(){
    var subject=fSubject.value.trim();
    if(!subject){fSubject.focus();return;}
    if(!editingRow)return;
    editingRow.setAttribute('data-subject',subject);
    editingRow.setAttribute('data-content',fContent.value);
    var now=new Date();
    var pad=function(n){return n<10?'0'+n:''+n;};
    var stamp=now.getFullYear()+'/'+pad(now.getMonth()+1)+'/'+pad(now.getDate())+' '+pad(now.getHours())+':'+pad(now.getMinutes());
    editingRow.cells[1].textContent='王志明';
    editingRow.cells[2].textContent=stamp;
    openModal(editingRow,false);
  });
})();
