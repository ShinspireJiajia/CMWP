(function(){
  var SUF='@starlux-airlines.com';
  var table=document.getElementById('coTable');
  var tbody=table.querySelector('tbody');
  var chkAll=document.getElementById('chkAll');
  var pagerTotal=document.getElementById('pagerTotal');

  function rows(){return Array.prototype.slice.call(tbody.querySelectorAll('tr'));}
  function visibleRows(){return rows().filter(function(tr){return tr.style.display!=='none';});}
  function updateTotal(){
    if(pagerTotal)pagerTotal.textContent='筆，共 '+rows().length+' 筆';
  }

  // ===== 搜尋 =====
  var q=document.getElementById('q');
  q.addEventListener('input',function(){
    var kw=q.value.trim().toLowerCase();
    rows().forEach(function(tr){
      var text=tr.textContent.toLowerCase();
      tr.style.display=(!kw||text.indexOf(kw)>-1)?'':'none';
    });
    syncChkAll();
  });

  // ===== 全選 / 單選 =====
  function syncChkAll(){
    var vis=visibleRows();
    var checks=vis.map(function(tr){return tr.querySelector('.rowChk');});
    chkAll.checked=checks.length>0&&checks.every(function(c){return c.checked;});
  }
  chkAll.addEventListener('change',function(){
    visibleRows().forEach(function(tr){tr.querySelector('.rowChk').checked=chkAll.checked;});
  });
  tbody.addEventListener('change',function(e){
    if(e.target.classList.contains('rowChk'))syncChkAll();
  });

  // ===== 排序 =====
  var headers=table.querySelectorAll('th.sortable');
  for(var h=0;h<headers.length;h++){
    headers[h].addEventListener('click',function(){
      var idx=this.cellIndex;
      var asc=this.getAttribute('data-dir')!=='asc';
      for(var j=0;j<headers.length;j++){headers[j].removeAttribute('data-dir');headers[j].querySelector('.caret').textContent='↕';}
      this.setAttribute('data-dir',asc?'asc':'desc');
      this.querySelector('.caret').textContent=asc?'▲':'▼';
      var list=rows();
      list.sort(function(a,b){
        var av=a.cells[idx].textContent.trim(),bv=b.cells[idx].textContent.trim();
        if(av<bv)return asc?-1:1;
        if(av>bv)return asc?1:-1;
        return 0;
      });
      list.forEach(function(tr){tbody.appendChild(tr);});
    });
  }

  // ===== 新增 / 編輯 對話框 =====
  var modal=document.getElementById('coModal');
  var fAlcp=document.getElementById('f-alcp'),fCffp=document.getElementById('f-cffp'),
      fTour=document.getElementById('f-tour'),fName=document.getElementById('f-name'),
      fCountry=document.getElementById('f-country'),fPic=document.getElementById('f-pic'),
      fEmail=document.getElementById('f-email');
  // 公司基本資料 / 聯絡資料（與 FE_03_申請入會資料 表單欄位對齊）
  var fNameEn=document.getElementById('f-nameEn'),fTaxid=document.getElementById('f-taxid'),
      fIndustry=document.getElementById('f-industry'),fEmployees=document.getElementById('f-employees'),
      fAddress=document.getElementById('f-address'),fDestinations=document.getElementById('f-destinations'),
      fRegion=document.getElementById('f-region'),fContact=document.getElementById('f-contact'),
      fPhone=document.getElementById('f-phone'),fCompanyEmail=document.getElementById('f-companyEmail'),
      fCompanyEmail2=document.getElementById('f-companyEmail2'),fBudget=document.getElementById('f-budget'),
      fAgency=document.getElementById('f-agency');
  var EXTRA_FIELDS=[
    ['nameEn',fNameEn],['taxid',fTaxid],['industry',fIndustry],['employees',fEmployees],
    ['address',fAddress],['destinations',fDestinations],['region',fRegion],['contact',fContact],
    ['phone',fPhone],['companyEmail',fCompanyEmail],['companyEmail2',fCompanyEmail2],
    ['budget',fBudget],['agency',fAgency]
  ];
  var editingRow=null;

  function nextAlcpId(){
    var n=rows().length;
    return 'ALCP'+String(n).padStart(4,'0');
  }
  function openModal(tr){
    editingRow=tr||null;
    document.getElementById('coModalTitle').textContent=tr?'編輯企業資料':'新增企業資料';
    if(tr){
      fAlcp.value=tr.cells[1].textContent.trim();
      fCffp.value=tr.cells[2].textContent.trim().replace(/^—$/,'');
      fTour.value=tr.cells[3].textContent.trim().replace(/^—$/,'');
      fName.value=tr.cells[4].textContent.trim();
      fCountry.value=tr.cells[5].textContent.trim();
      fPic.value=tr.cells[6].textContent.trim();
      fEmail.value=tr.cells[7].textContent.trim().split('@')[0];
      EXTRA_FIELDS.forEach(function(pair){pair[1].value=tr.dataset[pair[0]]||'';});
    }else{
      fAlcp.value=nextAlcpId();
      fCffp.value='';fTour.value='';fName.value='';fCountry.value='';fPic.value='';fEmail.value='';
      EXTRA_FIELDS.forEach(function(pair){pair[1].value='';});
    }
    modal.classList.add('show');
    fName.focus();
  }
  function closeModal(){modal.classList.remove('show');editingRow=null;}

  document.getElementById('btnAdd').addEventListener('click',function(){openModal(null);});
  tbody.addEventListener('click',function(e){
    if(e.target.classList.contains('row-edit')){
      openModal(e.target.closest('tr'));
    }
  });
  document.getElementById('coModalClose').addEventListener('click',closeModal);
  document.getElementById('coModalCancel').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('show'))closeModal();});

  function rowHtml(alcp,cffp,tour,name,country,pic,email){
    return '<td><input type="checkbox" class="rowChk"></td>'+
      '<td class="mono">'+alcp+'</td>'+
      '<td class="mono">'+(cffp||'—')+'</td>'+
      '<td class="mono">'+(tour||'—')+'</td>'+
      '<td>'+name+'</td>'+
      '<td><span class="pill brand">'+(country||'—')+'</span></td>'+
      '<td>'+(pic||'')+'</td>'+
      '<td class="muted">'+email+'</td>'+
      '<td><span class="lnk row-edit">編輯</span></td>';
  }

  document.getElementById('coModalSave').addEventListener('click',function(){
    var name=fName.value.trim();
    if(!name){fName.focus();return;}
    var email=(fEmail.value.trim()||'')+SUF;
    var html=rowHtml(fAlcp.value,fCffp.value.trim(),fTour.value.trim(),name,fCountry.value.trim(),fPic.value.trim(),email);
    var tr=editingRow||document.createElement('tr');
    tr.innerHTML=html;
    EXTRA_FIELDS.forEach(function(pair){tr.dataset[pair[0]]=pair[1].value.trim();});
    if(!editingRow)tbody.appendChild(tr);
    updateTotal();
    closeModal();
  });

  // ===== 刪除（勾選列） =====
  document.getElementById('btnDelete').addEventListener('click',function(){
    var checked=tbody.querySelectorAll('.rowChk:checked');
    if(!checked.length)return;
    checked.forEach(function(c){c.closest('tr').remove();});
    chkAll.checked=false;
    updateTotal();
  });

  // ===== 匯出 CSV（僅匯出目前可見資料） =====
  document.getElementById('btnExport').addEventListener('click',function(){
    var header=['ALCP ID','CFFP ID','Tour Code','CFFP Name','Country','JX PIC','email'];
    var lines=[header.join(',')];
    visibleRows().forEach(function(tr){
      var vals=[1,2,3,4,5,6,7].map(function(i){
        var v=tr.cells[i].textContent.trim();
        if(v.indexOf(',')>-1||v.indexOf('"')>-1)v='"'+v.replace(/"/g,'""')+'"';
        return v;
      });
      lines.push(vals.join(','));
    });
    var blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='企業資料維護.csv';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // ===== 匯入 CSV =====
  var importFile=document.getElementById('importFile');
  document.getElementById('btnImport').addEventListener('click',function(){importFile.click();});
  importFile.addEventListener('change',function(){
    var file=importFile.files[0];
    if(!file)return;
    var reader=new FileReader();
    reader.onload=function(){
      var text=String(reader.result).replace(/^﻿/,'');
      var lines=text.split(/\r\n|\n/).filter(function(l){return l.trim().length;});
      if(!lines.length){importFile.value='';return;}
      var start=/^ALCP\s*ID/i.test(lines[0])?1:0;
      for(var i=start;i<lines.length;i++){
        var cols=lines[i].split(',').map(function(c){return c.replace(/^"|"$/g,'').trim();});
        var alcp=cols[0]||nextAlcpId();
        var email=cols[6]||'';
        if(email&&email.indexOf('@')===-1)email+=SUF;
        var tr=document.createElement('tr');
        tr.innerHTML=rowHtml(alcp,cols[1],cols[2],cols[3]||'',cols[4],cols[5],email);
        tbody.appendChild(tr);
      }
      updateTotal();
      importFile.value='';
    };
    reader.readAsText(file,'utf-8');
  });
})();
