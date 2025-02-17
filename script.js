let dataContent=document.querySelector(".product-content");

async function getData(){
    const res=await fetch("https://fakestoreapi.com/products");
    const data=await res.json();
    data.forEach(x=>{
            let newdiv=document.createElement("div");
            newdiv.classList.add("product-box");
           newdiv.innerHTML=`<div class="img-box">
                    <img src="${x.image}" alt="">
                </div>
                <h2 class="product-title">${x.title.slice(0,25)}</h2>
                <div class="price-and-cart">
                    <span class="price">Price : $${x.price}</span>
                    <div class="btn btn-outline-success add-cart">Add To Cart</div>
                </div>`;
            dataContent.appendChild(newdiv);
            
            
    });
    const cartIcon=document.querySelector("#cart-icon");
const cart=document.querySelector(".cart");
const cartClose=document.querySelector("#cart-close");
cartIcon.addEventListener("click",()=>cart.classList.add("active"));
cartClose.addEventListener("click",()=>cart.classList.remove("active"));

const addCartButtons=document.querySelectorAll(".add-cart");
addCartButtons.forEach(button=>{
    button.addEventListener("click", event=>{
        const productBox=event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent=document.querySelector(".cart-content");
const addToCart=productBox=>{
    const productImgSrc=productBox.querySelector("img").src;
    const productTitle=productBox.querySelector(".product-title").textContent;
    const productPrice=productBox.querySelector(".price").textContent;

    const cartItems=cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems){
        if(item.textContent===productTitle){
            alert("This item is already in the Cart.");
            return;
        }
    }

    const cartBox=document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML=`
        <img src="${productImgSrc}" class="cart-img" alt="">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>
                    </div>
                </div>
                <i class="ri-delete-bin-6-line cart-remove"></i>
    
    `;
    cartContent.appendChild(cartBox);
    cartBox.querySelector(".cart-remove").addEventListener("click",()=>{
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
    });
    cartBox.querySelector(".cart-quantity").addEventListener("click",event=>{
        const numberElement=cartBox.querySelector(".number");
        const decrementButton=cartBox.querySelector("#decrement");
        let quantity=numberElement.textContent;

        if(event.target.id==="decrement" && quantity>1){
            quantity--;
            if (quantity===1){
                decrementButton.style.color="#999";
            }
        
        }else if (event.target.id==="increment"){
            quantity++;
            decrementButton.style.color="#333";
        }
        numberElement.textContent=quantity;
        updateTotalPrice();
    });
    updateCartCount(1);
    updateTotalPrice();
};

const updateTotalPrice=()=>{
    const totalPriceElement=document.querySelector(".total-price");
    const cartBoxes =cartContent.querySelectorAll(".cart-box");
    let total=0;
    cartBoxes.forEach(cartBox=>{
        const priceElement=cartBox.querySelector(".cart-price");
        const quantityElement=cartBox.querySelector(".number");
        const price=priceElement.textContent.replace("Price : $","");
        const quantity=quantityElement.textContent;
        total  +=price*quantity;

    });
    let grandTotal=total.toFixed(2)
    let pricediscount=document.querySelector(".discountprice")
    totalPriceElement.textContent=`$${grandTotal}`;
    pricediscount.textContent=`Discount Price $${grandTotal}`;
    
    let inputpromobox=document.getElementById("inputpromocode");
    inputpromobox.addEventListener("keyup",()=>{
        btnGetdiscount.classList.remove("btn-hidden");
        pricediscount.classList.add("btn-hidden")
        
    });
    function executeDiscount() {
        btnGetdiscount.classList.add("btn-hidden");
        pricediscount.classList.remove("btn-hidden")
        let text10discount=`Promocode valid, You have got 10% discount`;
        let text5discount=`Promocode valid, You have got 5% discount`;
        let textnodiscount=`No valid promocode, use valid promocode to get discount`;
        
        let promocodetext0="No Discount for using invalid promocode";
            if (inputpromobox.value =="ostad5"){
                let discountprice=grandTotal*.95;
                document.querySelector(".discountstatus").textContent=text5discount;
                pricediscount.textContent=`Discount Price $${discountprice}`;
            }
            else if (inputpromobox.value =="ostad10"){
                let discountprice=grandTotal*.9;
                document.querySelector(".discountstatus").innerHTML=text10discount;
                pricediscount.textContent=`Discount Price $${discountprice}`;
            }
            else if (inputpromobox.value ==""){
                
                document.querySelector(".discountstatus").innerHTML=textdiscount;
                pricediscount.textContent=`Discount Price $${grandTotal}`;
            }
            else {
                
                document.querySelector(".discountstatus").innerHTML=textnodiscount;
                pricediscount.textContent=`Discount Price $${grandTotal}`;
            }
            
            inputpromobox.value =""
            

        };
    let btnGetdiscount=document.querySelector(".getdiscount");
    btnGetdiscount.addEventListener("click",executeDiscount);

    

    if (grandTotal==0){
        document.querySelector(".cart-title").textContent="Your Cart is Empty!";
        document.querySelector(".btn-checkout").classList.add("btn-hidden");
        document.querySelector(".btn-clearcart").classList.add("btn-hidden");

    }
    else{
        document.querySelector(".cart-title").textContent="Your Cart";
        document.querySelector(".btn-checkout").classList.remove("btn-hidden");
        document.querySelector(".btn-clearcart").classList.remove("btn-hidden");
    };
};

let cartItemCount=0;
const updateCartCount=change=>{
    const cartItemCountBadge=document.querySelector(".cart-item-count");
    cartItemCount +=change;
    if (cartItemCount>0){
        cartItemCountBadge.style.visibility="visible";
        cartItemCountBadge.textContent=cartItemCount;
    }else {
        cartItemCountBadge.style.visibility="hidden";
        cartItemCountBadge.textContent="";
    };

};

 document.querySelector(".btn-checkout").addEventListener("click",()=>{
       
        alert(`Thanks for Paying ${document.querySelector(".discountprice").textContent.replace("Discount Price ","")}`);
        
    
    cartContent.querySelectorAll(".cart-box").forEach(element=>{element.remove();updateCartCount(-1);});
    const cart=document.querySelector(".cart");
    cart.classList.remove("active");
    let cartItemCountBadge=document.querySelector(".cart-item-count");
    cartItemCountBadge.style.visibility="hidden";
    document.querySelector(".discountstatus").innerHTML="Input a valid promocode to get discount";
    updateTotalPrice();
     });

document.querySelector(".btn-clearcart").addEventListener("click",()=>{
    cartContent.querySelectorAll(".cart-box").forEach(element=>{element.remove();updateCartCount(-1);});
    let cartItemCountBadge=document.querySelector(".cart-item-count");
    cartItemCountBadge.style.visibility="hidden";
    updateTotalPrice();
    });
};
getData();`Received ${amountRecieved}, Enjoy Shopping with Us`
