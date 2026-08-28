(function(){
  // 模擬後端授權名單儲存區：postGrants／putGrant 成功後才會寫入，getGrants 讀取此區
  // 姓名遮罩規則（姓氏,XXXX+名字最後一個字母）已於後台完成，前台僅原樣顯示
  var SERVER_GRANTS=[
    {id:'E900014361',name:'CHEN,XXXXUN'},
    {id:'E900014462',name:'WANG,XXXXG'},
    {id:'E900014503',name:'LIN,XXXXA'},
    {id:'E900014577',name:'HSU,XXXXN'},
    {id:'E900014620',name:'YEH,XXXXI'},
    {id:'E900014688',name:'TSAI,XXXXG'},
    {id:'E900014715',name:'LIU,XXXXN'},
    {id:'E900014759',name:'HUANG,XXXXI'},
    {id:'E900014802',name:'CHANG,XXXXA'},
    {id:'E900014846',name:'WU,XXXXG'},
    {id:'E900014891',name:'CHIU,XXXXN'},
    {id:'E900014933',name:'KUO,XXXXI'}
  ];
  var EMPLOYEES=[];

  // 模擬星宇會員卡號查詢結果（getMembership），僅列出的卡號視為查得到會員；姓名已遮罩
  var MEMBERSHIP_DB={
    '900014368':{membershipId:'E900014368',name:'PAO,XXN'},
    '900014900':{membershipId:'E900014900',name:'KUO,XXXXN'},
    '900014361':{membershipId:'E900014361',name:'CHEN,XXXXUN'}
  };

  function callAlcpGetGrants(cb){setTimeout(function(){cb(true,SERVER_GRANTS.slice());},400);}
  function callAlcpGetMembership(cardNo,cb){setTimeout(function(){cb(true,MEMBERSHIP_DB[cardNo]||null);},500);}
  function callAlcpPostGrants(candidate,cb){setTimeout(function(){cb(true);},500);}
  function callAlcpPutGrant(candidate,cb){
    setTimeout(function(){
      SERVER_GRANTS.push({id:candidate.membershipId,name:candidate.name});
      cb(true);
    },400);
  }

  var empBody=document.getElementById('empBody');
  var pagination=document.getElementById('pagination');
  var inpMemberNo=document.getElementById('inpMemberNo');
  var addFieldErr=document.getElementById('addFieldErr');
  var btnAdd=document.getElementById('btnAdd');
  var pageErr=document.getElementById('pageErr');
  var mask=document.getElementById('addModal');
  var mbody=document.getElementById('addModalBody');

  var pager=FePager(pagination,{
    getList:function(){return EMPLOYEES;},
    renderRows:function(pageItems){
      empBody.innerHTML=pageItems.map(function(e){
        return '<tr><td class="muted">'+e.id+'</td><td style="font-weight:600">'+e.name+'</td>'+
          '<td><span class="del-emp" data-id="'+e.id+'" style="color:#C1585A;font-weight:600;cursor:pointer">刪除</span></td></tr>';
      }).join('');
    }
  });
  function renderRows(){pager.render();}

  function refreshGrants(){
    callAlcpGetGrants(function(ok,list){
      if(ok){EMPLOYEES=list;renderRows();}
      else{showPageErr('取得員工名單失敗，請重新整理頁面');}
    });
  }
  refreshGrants();

  function showFieldErr(msg){addFieldErr.textContent=msg;addFieldErr.style.display='';}
  function hideFieldErr(){addFieldErr.style.display='none';}
  function showPageErr(msg){pageErr.innerHTML=msg+'<span class="x" id="pageErrClose">✕</span>';pageErr.style.display='flex';document.getElementById('pageErrClose').addEventListener('click',hidePageErr);}
  function hidePageErr(){pageErr.style.display='none';}

  // 卡號輸入：僅允許 9 碼數字，未滿 9 碼新增鈕反灰；滿 9 碼即呼叫 getMembership 預先查詢
  var membershipCache={};
  function isValidFormat(v){return /^[0-9]{9}$/.test(v);}
  function lookupMembership(cardNo){
    callAlcpGetMembership(cardNo,function(ok,data){
      if(inpMemberNo.value!==cardNo)return; // 輸入內容已變更，忽略過期回應
      membershipCache[cardNo]={ok:ok,data:data};
    });
  }
  inpMemberNo.addEventListener('input',function(){
    var v=inpMemberNo.value.replace(/\D/g,'').slice(0,9);
    if(v!==inpMemberNo.value)inpMemberNo.value=v;
    hideFieldErr();
    btnAdd.disabled=!isValidFormat(v);
    if(isValidFormat(v))lookupMembership(v);
  });
  inpMemberNo.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!btnAdd.disabled)btnAdd.click();
  });

  btnAdd.addEventListener('click',function(){
    var v=inpMemberNo.value;
    if(!isValidFormat(v)){showFieldErr('請輸入 9 碼數字會員卡號');return;}
    var cached=membershipCache[v];
    if(!cached){showFieldErr('查詢中，請稍候再試一次');lookupMembership(v);return;}
    if(!cached.ok){showFieldErr('系統忙碌，請稍後再試');return;}
    if(!cached.data){showFieldErr('查無此會員卡號，請確認後再輸入');return;}
    var dup=EMPLOYEES.some(function(e){return e.id===cached.data.membershipId;});
    if(dup){showFieldErr('此會員已存在於員工名單中');return;}
    hideFieldErr();
    openAddConfirm({cardNo:v,membershipId:cached.data.membershipId,name:cached.data.name});
  });

  function closeModal(){mask.classList.remove('show');}
  function openModal(){mask.classList.add('show');}
  function renderProcessing(step){mbody.innerHTML='<div class="mtxt proc"><span class="spinner"></span>'+step+'</div>';}

  function openAddConfirm(c){
    mbody.innerHTML=
      '<div class="mtxt">確定新增<b>'+c.membershipId+'</b><b>'+c.name+'</b>？</div>'+
      '<div class="mbtns"><button class="mbtn ok" id="mOk">確認</button><button class="mbtn cancel" id="mCancel">返回</button></div>';
    document.getElementById('mOk').addEventListener('click',function(){runAdd(c);});
    document.getElementById('mCancel').addEventListener('click',closeModal);
    openModal();
  }

  function runAdd(c){
    renderProcessing('Call ALCP（postGrants）新增授權…');
    callAlcpPostGrants(c,function(ok1){
      if(!ok1){finishWithError();return;}
      renderProcessing('Call ALCP（putGrant）更新授權狀態…');
      callAlcpPutGrant(c,function(ok2){
        if(!ok2){finishWithError();return;}
        finishWithSuccess();
      });
    });
  }

  function finishWithSuccess(){
    closeModal();
    inpMemberNo.value='';
    btnAdd.disabled=true;
    hideFieldErr();
    refreshGrants();
  }

  function finishWithError(){
    closeModal();
    showPageErr('新增員工失敗，請稍後再試一次');
  }

  mask.addEventListener('click',function(e){if(e.target===mask)closeModal();});
})();
