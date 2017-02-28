$(function(){
    $(".detail_purchase").hover(function(){
        $(".detail_purchase_list").removeClass("active");
        $(this).children(".detail_purchase_list").addClass("active");
        $(this).children(".detail_purchase_list").css("border","1px solid #13b5bd");
    },function(){
        $(".detail_purchase_list").removeClass("active");
        $(this).children(".detail_purchase_list").css("border","1px solid #f3f2f0");
    });
});