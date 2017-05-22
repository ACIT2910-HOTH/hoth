$(document).ready(function(){
    var shopDisStatus = document.getElementById("shop_status");
    var shopSwitch = document.getElementById("switch");
    var showCustomer = document.getElementById("show_customer_accounts");
    var showChef = document.getElementById("show_employee_accounts");
    var showAdmin = document.getElementById("show_admin_accounts");
    var summary = document.getElementById("show_summary");
    var discardFood = document.getElementById("show_discard_food");
    
    
    var displayDiv = document.getElementById("container");
   
    
    
    
    $.ajax({
        url:"/get/shopstatus",
        type:"post",
        success:function(resp){
            if(resp.shopStatus == 0){
                shopDisStatus.innerHTML = "Shop is Closed";
                shopSwitch.checked = false;
            } else{
                shopDisStatus.innerHTML = "Shop is openning";
                shopSwitch.checked = true;
            }
        }
    });
    
    shopSwitch.addEventListener("click",function(){
        
        if(shopSwitch.checked){
            $.ajax({
                url:"/open/close",
                type:"post",
                data:{
                    shopStatus:1
                },
                success:function(resp){
                    shopSwitch.checked = true;
                    shopDisStatus.innerHTML = "Shop is openning";
                }
            })
        } else{
            if(confirm("Closed the shop")){
                $.ajax({
                url:"/open/close",
                type:"post",
                data:{
                    shopStatus:0
                },
                success:function(resp){
                    shopSwitch.checked = false;
                    shopDisStatus.innerHTML = "Shop is Closed";
                }
            })
            } else{
                shopSwitch.checked = true;
            }
        }
    });
    
    showChef.addEventListener("click",function(){
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"E"
            },
            success:function(resp){
                
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                    listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"E")
                }
            }
        })
        
    });
    
    showAdmin.addEventListener("click",function(){
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"A"
            },
            success:function(resp){
               
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                     listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"A")
                }
            }
        })
        
    });
    
    showCustomer.addEventListener("click",function(){
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"C"
            },
            success:function(resp){
                
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                 listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"C")
                }
            }
        })
        
    });
    
    summary.addEventListener("click",function(){
       
        $.ajax({
            url:"/order/summary",
            type:"post",
            success:function(resp){
                console.log(resp)
                var table = document.getElementById("table");
                table.remove();
                
                listSummaryHeader(resp.totalIncome,resp.orderNumber);
				var newT1 = document.getElementById("table")
                for(var i = 0; i < resp.rows.length;i++){
                    listOrders(newT1,resp.rows[i].order_id,resp.rows[i].customer,resp.rows[i].created,resp.rows[i].total_price)
                }
            }
        })
    });
	
	discardFood.addEventListener("click",function(){
       
        $.ajax({
            url:"/discard",
            type:"post",
            success:function(resp){
                console.log(resp)
                var table = document.getElementById("table");
                table.remove();
                
                var newT = document.createElement("table");
				newT.className = "table";
				newT.id = "table";
				
				var header = newT.insertRow();
				var headcel0 = header.insertCell(0);
				var headcel1 = header.insertCell(1);
				headcel0.innerHTML = "<b>Item name</b>";
				headcel1.innerHTML = "<b>Discard number</b>";
				displayDiv.appendChild(newT);
				
                for(var i = 0; i < resp.length;i++){
                    listDiscardItem(newT,resp[i].item_name,resp[i].numbers)
                }
            }
        })
    });
    
    
    
    function listTableHeader(){
        var newT = document.createElement("table");
        newT.className = "table";
        newT.id = "table";
        var row = newT.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        var cel4 = row.insertCell(4);
        var cel5 = row.insertCell(5);
        cel0.innerHTML = "<b>User Name</b>";
        cel1.innerHTML ="<b>Email</b>";
        cel2.innerHTML ="<b>First Name</b>";
        cel3.innerHTML ="<b>Last Name</b>";
        cel4.innerHTML ="<b>Auth_Level</b>";

        displayDiv.appendChild(newT);
	}
    
    function listAccounts(newtable,userId,username,email,firstName,lastName,authLevel){
		
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        var cel4 = row.insertCell(4);
        var cel5 = row.insertCell(5);
        var selectO = document.createElement("select");
        var op1 = document.createElement("option");
        var op2 = document.createElement("option");
        var op3 = document.createElement("option");
        var updateB = document.createElement("button")
        selectO.id = "select-"+userId;
        op1.value = "C";
        op1.innerHTML = "Customer";
        op2.value = "E";
        op2.innerHTML = "Cheif";
        op3.value = "A"
        op3.innerHTML = "Admin"
        selectO.appendChild(op1)
        selectO.appendChild(op2)
        selectO.appendChild(op3)
        if(authLevel == "C"){
            selectO.selectedIndex = 0;
        } else if (authLevel == "E"){
            selectO.selectedIndex = 1;
        } else if (authLevel == "A"){
            selectO.selectedIndex = 2;
        }
        
        
        updateB.innerHTML = "Update";
        updateB.id = "Upbutton"+ userId;

        cel0.innerHTML = username;
        cel1.innerHTML = email;
        cel2.innerHTML = firstName;
        cel3.innerHTML = lastName;
        cel4.appendChild(selectO);
        cel5.appendChild(updateB)
        
        updateB.addEventListener("click",function(){
            var auth_level = document.getElementById("select-"+userId);
            var currentUser = userId;
            $.ajax({
                url:"/auth",
                type:"post",
                data:{
                    user:currentUser,
                    auth:auth_level.value
                },
                success:function(resp){
					alert("Updated account auth")
				}
            });
            
        });
        
        
    }
	
    
    function listSummaryHeader(income,orderNumber){
        var newT = document.createElement("table");
        newT.className = "table";
        newT.id = "table";
        
        var header = newT.insertRow();
        var headcel0 = header.insertCell(0);
        var headcel1 = header.insertCell(1);
        headcel0.innerHTML = "<b>Total Order Number is </b>" + orderNumber;
        headcel1.innerHTML = "<b>Total income is $ </b> " + income;
        
        var row = newT.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        
        cel0.innerHTML = "<b>Order Id</b>";
        cel1.innerHTML ="<b>customer</b>";
        cel2.innerHTML ="<b>Time Created</b>";
        cel3.innerHTML ="<b>Total Price</b>";
        

        displayDiv.appendChild(newT);
	}
		
				
	function listOrders(newtable,orderId,username,time,price){
        
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        
        

        cel0.innerHTML = orderId;
        cel1.innerHTML = username;
        cel2.innerHTML = time;
        cel3.innerHTML = price;
        
    }
	
	function listDiscardItem(newtable,ItemName,Quantity){
        
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        
        
        

        cel0.innerHTML = ItemName;
        cel1.innerHTML = Quantity;
       
        
    }
				
				
	
				
	
    
    
    
    
});