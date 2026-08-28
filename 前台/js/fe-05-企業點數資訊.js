(function(){
  var RECORDS=[
    {cat:'點數',amt:'+ 3,500 CP',color:'#4C8C5A',desc:'第三季消費累積達門檻點數',date:'2025/08/20',pill:'brand'},
    {cat:'機場禮遇',amt:'- 800 CP',color:'#C1585A',desc:'貴賓室休憩／優先報到禮遇',date:'2025/09/15',pill:'error'},
    {cat:'酬賓機票',amt:'- 3,200 CP',color:'#C1585A',desc:'港澳線經濟艙機票',date:'2025/10/03',pill:'error'},
    {cat:'點數',amt:'+ 5,500 CP',color:'#4C8C5A',desc:'第四季消費累積達門檻點數',date:'2025/11/01',pill:'brand'},
    {cat:'升等位',amt:'- 2,500 CP',color:'#C1585A',desc:'亞洲區間豪華經濟艙升等商務艙',date:'2025/12/18',pill:'error'},
    {cat:'機場禮遇',amt:'- 800 CP',color:'#C1585A',desc:'行李優先／專屬報到櫃台禮遇',date:'2026/01/09',pill:'error'},
    {cat:'點數',amt:'+ 6,000 CP',color:'#4C8C5A',desc:'半年度累積達門檻點數',date:'2026/02/01',pill:'brand'},
    {cat:'酬賓機票',amt:'- 4,500 CP',color:'#C1585A',desc:'亞洲不限航點經濟艙機票',date:'2026/02/11',pill:'error'},
    {cat:'酬賓機票',amt:'+ 4,500 CP',color:'#4C8C5A',desc:'REFUND-亞洲不限航點經濟艙機票',date:'2026/02/18',pill:'success'},
    {cat:'酬賓機票',amt:'- 3,200 CP',color:'#C1585A',desc:'港澳線經濟艙機票',date:'2026/03/24',pill:'error'},
    {cat:'升等位',amt:'- 8,000 CP',color:'#C1585A',desc:'亞洲區間經濟艙升等商務艙',date:'2026/04/02',pill:'error'},
    {cat:'點數',amt:'+ 11,500 CP',color:'#4C8C5A',desc:'年度累積達門檻點數',date:'2026/05/01',pill:'brand'},
    {cat:'機場禮遇',amt:'- 800 CP',color:'#C1585A',desc:'貴賓室休憩禮遇',date:'2026/06/20',pill:'error'},
    {cat:'點數',amt:'+ 2,000 CP',color:'#4C8C5A',desc:'企業會員週年紅利點數',date:'2026/07/15',pill:'brand'}
  ];

  var segs=document.querySelectorAll('.seg span');
  var ptsBody=document.getElementById('ptsBody');
  var pagination=document.getElementById('pagination');
  var currentCat='全部';

  function filteredRecords(){
    return currentCat==='全部'?RECORDS:RECORDS.filter(function(r){return r.cat===currentCat;});
  }

  var pager=FePager(pagination,{
    getList:filteredRecords,
    renderRows:function(pageItems){
      ptsBody.innerHTML=pageItems.map(function(r){
        return '<tr data-cat="'+r.cat+'"><td style="font-weight:700;color:'+r.color+'">'+r.amt+'</td><td>'+r.desc+'</td><td class="muted">'+r.date+'</td><td><span class="pill '+r.pill+'">'+r.cat+'</span></td></tr>';
      }).join('');
    }
  });

  for(var i=0;i<segs.length;i++){(function(seg){
    seg.addEventListener('click',function(){
      for(var j=0;j<segs.length;j++){segs[j].classList.remove('is-selected');}
      seg.classList.add('is-selected');
      currentCat=seg.getAttribute('data-cat');
      pager.reset();
    });
  })(segs[i]);}

  pager.render();
})();
