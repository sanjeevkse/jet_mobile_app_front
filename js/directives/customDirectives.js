app.directive("allowOnlyRupees",function(){return{restrict:"A",link:function(h,i,c,e){i.on("keydown",function(h){var i=$(this),c=i.val();return c=c.replace(/[^0-9.]/g,""),i.val(c),64!=h.which&&16!=h.which&&(h.which>=48&&h.which<=57||(h.which>=96&&h.which<=105||(9==h.which||(190==h.which||110==h.which||([8,13,27,37,38,39,40].indexOf(h.which)>-1||(h.preventDefault(),!1))))))})}}});