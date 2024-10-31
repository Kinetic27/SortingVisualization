function f_bsnsAncmBtinSituListForm_view(ancmId,ancmPrg) {

    $("input[name=ancmId]").val(ancmId);
    $("input[name=ancmPrg]").val(ancmPrg);
    

    $("input[name=input_notice_blltCn_p]").val("");
    
    $("#bsnsAncmBtinSituListForm").attr("action","/contents/retrieveBsnsAncmView.do");
    $("#bsnsAncmBtinSituListForm").submit();
    
    $("#bsnsAncmDetailForm").attr("action","/contents/retrieveBsnsAncmView.do");
    $("#bsnsAncmDetailForm").submit();

    $("#mainPageListForm").attr("action","/contents/retrieveBsnsAncmView.do");
    $("#mainPageListForm").submit();
}

const articles = [...document.querySelectorAll('.biz_announce_slider .no-gutters > .item')].map((e) => {
    let clickLink = e.querySelector('a').getAttribute('onclick');
    let name1 = e.querySelector('.depart > strong').innerHTML;
    let name2 = e.querySelector('.depart > em').innerHTML;
    let name3 = e.querySelector('.title').innerHTML;
    let status = e.querySelector('.state').innerHTML;
   
    return [name1, name2, name3, status, clickLink[0]];
});

eval(articles[0][4]);