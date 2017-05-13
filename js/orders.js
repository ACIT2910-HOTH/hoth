$(document).ready(function(){    
    var orderDispaly = document.getElementById("order-div");
    var submitButton = document.getElementById("order-submit-btn"),
        cancelButton = document.getElementById("order-cancel-btn");
    
    var socket = io();
    
    
    var orders = {};
    var itemName = [];
    var itemPrice = [];
    var itemQuantity = [];
    var totalPrice = 0;
      
    
    $.ajax({
        url:"/get/orders",
        type:"post",
        success:function(resp){
            orders = resp.orders[0];
            getOrderItems(orders)
            
            for(var i=0; i<itemQuantity.length;i++){
                var itemTotalPrice = itemPrice[i] * itemQuantity[i];

                var newD = document.createElement('div');
                newD.innerHTML = itemName[i]+" X "+ itemQuantity[i]+ " $"+itemTotalPrice;
                orderDispaly.appendChild(newD);
                totalPrice = totalPrice + itemTotalPrice;
                
            }
            newD = document.createElement('hr')
            orderDispaly.appendChild(newD)
            newD2 = document.createElement('div')
            newD2.innerHTML = "Total price is " + totalPrice;
            orderDispaly.appendChild(newD2)
            
        }
    });
    
   
    function getOrderItems(orders){
        Object.keys(orders).forEach(function(key){
                var orderItem = key;
                var quantity = parseInt(orders[key]);
                
                itemQuantity.push(quantity)
                
                $.ajax({
                    url:"/get/price",
                    type:"post",
                    data: {
                        item:orderItem
                    },
                    success:function(resp){
                        itemName.push(resp.name)
                        itemPrice.push(parseFloat(resp.price))
                
                    },
                    async:false
                });
            
            });
    };
    
    submitButton.addEventListener("click",function(){
        
        $.ajax({
                url:"/save/order",
                type:"post",
                data:{
                    totalPirce:totalPrice
                    },
                success:function(resp){
                    console.log(resp)
                    var orderId = resp.id;
                    for(var i=0; i<itemName.length;i++){
                        $.ajax({
                            url:"/order/detailes",
                            type:"post",
                            data:{
                                name:itemName[i],
                                quantity:itemQuantity[i],
                                id:orderId
                            },
                            success:function(resp){
                               
                            }
                        })
                    }
                }
            })
        
        socket.emit("send message", orders);
        
        console.log("orders submitted");
        
        
        
    })
    
    cancelButton.addEventListener("click",function(){
        location.href = "/"
    })
    
});