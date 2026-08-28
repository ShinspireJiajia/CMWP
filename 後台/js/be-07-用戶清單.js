(function(){
  var DIRECTORY=[
    {id:'2320262',name:'Hanks Kuo'},
    {id:'1900123',name:'Ivy Cheng'},
    {id:'2000456',name:'Jerry Pao'},
    {id:'2100789',name:'Daming Wang'},
    {id:'2210345',name:'Sabina Lin'},
    {id:'2050678',name:'Ashley Huang'},
    {id:'1980234',name:'Kevin Chen'},
    {id:'2260591',name:'Wendy Su'},
    {id:'2190812',name:'Oscar Yeh'},
    {id:'2130456',name:'Tina Lai'}
  ];

  // 角色權限清單：資料來源與 BE_11_角色權限管理.html 的角色權限清單一致
  var ROLES=[
    {name:'平台管理員',status:'啟用'},
    {name:'一般使用者',status:'啟用'}
  ];
  var ACTIVE_ROLES=ROLES.filter(function(r){return r.status==='啟用';});

  var tbody=document.getElementById('userTbody');
  var pagerTotal=document.getElementById('pagerTotal');
  var filterRole=document.getElementById('filterRole');

  var addModal=document.getElementById('addModal');
  var searchInp=document.getElementById('addSearch');
  var resultsBox=document.getElementById('addResults');
  var roleSeg=document.getElementById('addRoleSeg');
  var errBox=document.getElementById('addErr');

  var userModal=document.getElementById('userModal');
  var userModalTitle=document.getElementById('userModalTitle');
  var umAccount=document.getElementById('umAccount');
  var umName=document.getElementById('umName');
  var umRoleSeg=document.getElementById('umRoleSeg');
  var umStatusSeg=document.getElementById('umStatusSeg');
  var userModalSave=document.getElementById('userModalSave');
  var userModalCancel=document.getElementById('userModalCancel');
  var userModalClose=document.getElementById('userModalClose');

  var delModal=document.getElementById('delModal');
  var delMsg=document.getElementById('delMsg');
  var delModalConfirm=document.getElementById('delModalConfirm');
  var delModalCancel=document.getElementById('delModalCancel');
  var delModalClose=document.getElementById('delModalClose');

  var selectedCandidate=null;
  var selectedRole=null;
  var currentRow=null;
  var currentMode=null; // 'view' | 'edit'
  var rowToDelete=null;

  function rows(){return Array.prototype.slice.call(tbody.querySelectorAll('tr'));}
  function renumber(){rows().forEach(function(tr,i){tr.cells[0].textContent=i+1;});}
  function updateTotal(){if(pagerTotal)pagerTotal.textContent='筆，共 '+rows().length+' 筆';}
  function existingIds(){return rows().map(function(tr){return tr.cells[1].textContent.trim();});}

  // ===== 角色權限篩選下拉：資料來源為 BE_11 角色權限清單 =====
  ROLES.forEach(function(r){
    var opt=document.createElement('option');
    opt.textContent=r.name;
    filterRole.appendChild(opt);
  });

  function buildRoleSeg(container,selected,readonly){
    container.innerHTML=ACTIVE_ROLES.map(function(r){
      return '<span data-role="'+r.name+'"'+(r.name===selected?' class="is-selected"':'')+'>'+r.name+'</span>';
    }).join('');
    container.classList.toggle('is-readonly',!!readonly);
  }

  function setSegSelected(seg,attr,value){
    seg.querySelectorAll('span').forEach(function(s){
      s.classList.toggle('is-selected',s.getAttribute(attr)===value);
    });
  }

  // ===== 新增使用者 =====
  function resetAddModal(){
    searchInp.value='';
    selectedCandidate=null;
    selectedRole=null;
    buildRoleSeg(roleSeg,null,false);
    errBox.textContent='';
    resultsBox.innerHTML='<div class="add-result-empty">請輸入 User ID 或英文姓名進行搜尋</div>';
  }
  function openAddModal(){resetAddModal();addModal.classList.add('show');searchInp.focus();}
  function closeAddModal(){addModal.classList.remove('show');resetAddModal();}

  document.getElementById('btnAddUser').addEventListener('click',openAddModal);
  document.getElementById('addModalClose').addEventListener('click',closeAddModal);
  document.getElementById('addModalCancel').addEventListener('click',closeAddModal);
  addModal.addEventListener('click',function(e){if(e.target===addModal)closeAddModal();});

  searchInp.addEventListener('input',function(){
    var kw=searchInp.value.trim().toLowerCase();
    selectedCandidate=null;
    if(!kw){
      resultsBox.innerHTML='<div class="add-result-empty">請輸入 User ID 或英文姓名進行搜尋</div>';
      return;
    }
    var already=existingIds();
    var matches=DIRECTORY.filter(function(p){
      if(already.indexOf(p.id)>-1)return false;
      return p.id.toLowerCase().indexOf(kw)>-1||p.name.toLowerCase().indexOf(kw)>-1;
    });
    if(!matches.length){
      resultsBox.innerHTML='<div class="add-result-empty">查無符合的人員</div>';
      return;
    }
    resultsBox.innerHTML=matches.map(function(p){
      return '<div class="add-result-item" data-id="'+p.id+'" data-name="'+p.name+'">'+
        '<div class="rid">'+p.id+'</div><div class="rname">'+p.name+'</div></div>';
    }).join('');
  });

  resultsBox.addEventListener('click',function(e){
    var item=e.target.closest('.add-result-item');
    if(!item)return;
    resultsBox.querySelectorAll('.add-result-item').forEach(function(el){el.classList.remove('is-selected');});
    item.classList.add('is-selected');
    selectedCandidate={id:item.getAttribute('data-id'),name:item.getAttribute('data-name')};
  });

  roleSeg.addEventListener('click',function(e){
    var span=e.target.closest('span');
    if(!span)return;
    roleSeg.querySelectorAll('span').forEach(function(s){s.classList.remove('is-selected');});
    span.classList.add('is-selected');
    selectedRole=span.getAttribute('data-role');
  });

  document.getElementById('addModalConfirm').addEventListener('click',function(){
    if(!selectedCandidate){
      errBox.textContent='請先搜尋並選取欲新增的人員';
      return;
    }
    if(!selectedRole){
      errBox.textContent='請選擇角色權限';
      return;
    }
    var tr=document.createElement('tr');
    tr.innerHTML='<td></td>'+
      '<td class="mono">'+selectedCandidate.id+'</td>'+
      '<td style="font-weight:600">'+selectedCandidate.name+'</td>'+
      '<td>'+selectedRole+'</td>'+
      '<td>啟用</td>'+
      '<td><span class="lnk" data-action="view">檢視</span> ｜ <span class="lnk" data-action="edit" style="color:#4C8C5A">編輯</span> ｜ <span class="lnk" data-action="delete" style="color:#C1585A">刪除</span></td>';
    tbody.appendChild(tr);
    renumber();
    updateTotal();
    closeAddModal();
  });

  // ===== 檢視／編輯使用者 =====
  function openView(tr){
    currentRow=tr;currentMode='view';
    umAccount.textContent=tr.cells[1].textContent.trim();
    umName.textContent=tr.cells[2].textContent.trim();
    userModalTitle.textContent='檢視使用者';
    buildRoleSeg(umRoleSeg,tr.cells[3].textContent.trim(),true);
    setSegSelected(umStatusSeg,'data-status',tr.cells[4].textContent.trim());
    umStatusSeg.classList.add('is-readonly');
    userModalSave.style.display='none';
    userModalCancel.textContent='關閉';
    userModal.classList.add('show');
  }

  function openEdit(tr){
    currentRow=tr;currentMode='edit';
    umAccount.textContent=tr.cells[1].textContent.trim();
    umName.textContent=tr.cells[2].textContent.trim();
    userModalTitle.textContent='編輯使用者';
    buildRoleSeg(umRoleSeg,tr.cells[3].textContent.trim(),false);
    setSegSelected(umStatusSeg,'data-status',tr.cells[4].textContent.trim());
    umStatusSeg.classList.remove('is-readonly');
    userModalSave.style.display='';
    userModalCancel.textContent='取消';
    userModal.classList.add('show');
  }

  function closeUserModal(){
    userModal.classList.remove('show');
    currentRow=null;currentMode=null;
  }

  umRoleSeg.addEventListener('click',function(e){
    if(currentMode!=='edit')return;
    var span=e.target.closest('span');
    if(!span)return;
    setSegSelected(umRoleSeg,'data-role',span.getAttribute('data-role'));
  });
  umStatusSeg.addEventListener('click',function(e){
    if(currentMode!=='edit')return;
    var span=e.target.closest('span');
    if(!span)return;
    setSegSelected(umStatusSeg,'data-status',span.getAttribute('data-status'));
  });

  userModalSave.addEventListener('click',function(){
    if(!currentRow)return;
    var roleSpan=umRoleSeg.querySelector('span.is-selected');
    var statusSpan=umStatusSeg.querySelector('span.is-selected');
    if(!roleSpan||!statusSpan)return;
    currentRow.cells[3].textContent=roleSpan.getAttribute('data-role');
    currentRow.cells[4].textContent=statusSpan.getAttribute('data-status');
    closeUserModal();
  });
  userModalCancel.addEventListener('click',closeUserModal);
  userModalClose.addEventListener('click',closeUserModal);
  userModal.addEventListener('click',function(e){if(e.target===userModal)closeUserModal();});

  // ===== 刪除使用者 =====
  function openDelete(tr){
    rowToDelete=tr;
    delMsg.textContent='確定要刪除使用者「'+tr.cells[2].textContent.trim()+'」（'+tr.cells[1].textContent.trim()+'）嗎？此操作無法復原。';
    delModal.classList.add('show');
  }
  function closeDelete(){delModal.classList.remove('show');rowToDelete=null;}

  delModalConfirm.addEventListener('click',function(){
    if(rowToDelete){
      rowToDelete.parentNode.removeChild(rowToDelete);
      renumber();
      updateTotal();
    }
    closeDelete();
  });
  delModalCancel.addEventListener('click',closeDelete);
  delModalClose.addEventListener('click',closeDelete);
  delModal.addEventListener('click',function(e){if(e.target===delModal)closeDelete();});

  // ===== 表格操作列委派（檢視／編輯／刪除） =====
  tbody.addEventListener('click',function(e){
    var span=e.target.closest('.lnk');
    if(!span)return;
    var tr=span.closest('tr');
    if(!tr)return;
    var action=span.getAttribute('data-action');
    if(action==='view')openView(tr);
    else if(action==='edit')openEdit(tr);
    else if(action==='delete')openDelete(tr);
  });

  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    if(addModal.classList.contains('show'))closeAddModal();
    if(userModal.classList.contains('show'))closeUserModal();
    if(delModal.classList.contains('show'))closeDelete();
  });
})();
