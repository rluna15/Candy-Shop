async function GetProductsJSON() {
    let url = "products.json";
    try {
        let res = await fetch(url);
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function Main() {
    let items = await GetProductsJSON();
    CreateShop(items);
    CreateCart();
    DisplayCount();

}

function DisplayCount() {
    let countContainer = document.querySelector("#count");
    let count = JSON.parse(localStorage.getItem("ItemCount"));
    if (count == 0) {
        countContainer.innerHTML = "";
    } else {
        countContainer.innerHTML = count;
    }
}

function CreateShop(items) {
    let container = document.querySelector("#item-container");

    if (container != null) {
        container.innerHTML = ``;
        
        for (var i = 0; i < items.length; i++) {
            container.innerHTML += `
            <div class="col" id="item">
                <div class="card shadow-sm h-100">
                    <img src="./images/placeholder.png" alt="" />
                    <div class="card-body">
                        <h5 class="fw-bold text-center py-2 mb-0">
                        ${items[i].name}
                        </h5>
                    </div>
                    <div class="card border-0">
                        <h4 class="text-center text-muted">$${items[i].price}.00</h4>
                        <button class="btn btn-lg btn-outline-secondary"
                            data-bs-toggle="modal" 
                            data-bs-target="#${items[i].name}-modal">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
            <!--Modal For ${items[i].name}-->
            <div class="modal fade" id="${items[i].name}-modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${items[i].name}</h5>
                            <button class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid"src="./images/placeholder.png"/>
                            <h4>$${items[i].price}</h4>
                            <p>${items[i].info}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline-primary" id="addToCart"> Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        GetBuyButtonsListeners(items);
    } else {
        return;
    }
}

function GetBuyButtonsListeners(items) {
    let buyButtons = document.querySelectorAll("#addToCart");
    //let itemList = document.querySelectorAll("#item");

    for (let i = 0; i < buyButtons.length; i++) {
        buyButtons[i].addEventListener("click", function () {
            StoreItems(items[i]);
        });
    }
}

function StoreItems(item) {
    let cartItems = JSON.parse(localStorage.getItem("Cart"));

    if (cartItems) {
        if (cartItems[item.name] == undefined) {
            cartItems = {
                ...cartItems, [item.name]: item
            }
        }
        cartItems[item.name].incart += 1;
    } else {
        item.incart = 1;
        cartItems = { [item.name]: item };
    }

    localStorage.setItem("Cart", JSON.stringify(cartItems));
    ItemCounter();
    location.reload();
}

function ItemCounter() {
    let itemCount = parseInt(localStorage.getItem("ItemCount"));
    if (itemCount) {
        localStorage.setItem("ItemCount", itemCount + 1);
    } else {
        localStorage.setItem("ItemCount", 1);
    }
}

function CreateCart() {
    let cartContainer = document.querySelector("#cart-container");

    if (cartContainer != null) {
        let cartObj = JSON.parse(localStorage.getItem("Cart"));
        let cartItems = Object.values(cartObj);

        for (let i = 0; i < cartItems.length; i++) {
            cartContainer.innerHTML += `
            <div class="border border-2 rounded m-2"id="cartItem">
            <h3 class="text-center">${cartItems[i].name}</h3>
            <p class="fs-5 text-center">$${cartItems[i].price}</p>
            <div class="text-center">
            <span class="btn-sm btn-outline-primary bi bi-caret-left" id="minus"></span>
            <span class="px-1 fw-bold" id="counter">${cartItems[i].incart}</span>
            <span class="btn-sm btn-outline-primary bi bi-caret-right" id="plus"></span>
            </div>
            <div class="text-center my-4">
            <button class="btn btn-sm btn-danger bi-x-lg" id="delete"></button>
            </div>
            </div>
            `;
        }
        GetDeleteButtons();
        GetQuantityButtons();
        DisplayCount();
        CalculateTotal();
    } else {
        return;
    }
}

function GetDeleteButtons() {
    let deleteButtons = document.querySelectorAll("#delete");
    let cartList = document.querySelectorAll("#cartItem");

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function () {
            cartItem = cartList[i];
            RemoveFromCart(cartItem);
            UpdateItemCount(i);
        });
    }
}

function RemoveFromCart(item) {
    let cartItems = JSON.parse(localStorage.getItem("Cart"));
    var itemName = item.firstElementChild.innerHTML;

    delete cartItems[itemName];

    localStorage.setItem("Cart", JSON.stringify(cartItems));
    location.reload();
}

function UpdateItemCount(i) {
    let itemCount = JSON.parse(localStorage.getItem("ItemCount"));
    let counters = document.querySelectorAll("#counter");

    itemCount -= counters[i].innerHTML;

    localStorage.setItem("ItemCount", JSON.stringify(itemCount));
}

function GetQuantityButtons() {
    let cartList = document.querySelectorAll("#cartItem");
    let minus = document.querySelectorAll("#minus");
    let plus = document.querySelectorAll("#plus");

    for (let i = 0; i < minus.length; i++) {
        minus[i].addEventListener("click", function () {
            let item = cartList[i];
            SubtractFromCount(item);
        })
    }

    for (let i = 0; i < plus.length; i++) {
        plus[i].addEventListener("click", function () {
            let item = cartList[i];
            AddToCount(item);
        })
    }
}

function AddToCount(item) {
    let cartItems = JSON.parse(localStorage.getItem("Cart"));
    let itemCount = parseInt(localStorage.getItem("ItemCount"));
    let itemName = item.firstElementChild.innerHTML;

    cartItems[itemName].incart += 1;

    localStorage.setItem("ItemCount", itemCount + 1);
    localStorage.setItem("Cart", JSON.stringify(cartItems));

    location.reload();
}

function SubtractFromCount(item) {
    let cartItems = JSON.parse(localStorage.getItem("Cart"));
    let itemCount = parseInt(localStorage.getItem("ItemCount"));
    let itemName = item.firstElementChild.innerHTML;

    if (cartItems[itemName].incart == 1) {
        return;
    } else {
        cartItems[itemName].incart -= 1;
    }

    localStorage.setItem("ItemCount", itemCount - 1);
    localStorage.setItem("Cart", JSON.stringify(cartItems));

    location.reload();
}

function CalculateTotal() {
    let totalContainer = document.querySelector("#total");
    let cartObj = JSON.parse(localStorage.getItem("Cart"));
    let cartItems = Object.values(cartObj);
    let total = 0;

    if (totalContainer != null) {
        if (cartItems.length == 0) {
            totalContainer.innerHTML = total;
        } else {
            for (let i = 0; i < cartItems.length; i++) {
                let cal = cartItems[i].price * cartItems[i].incart;
                total += cal;
                totalContainer.innerHTML = total;
            }
        }
    }
}

Main();