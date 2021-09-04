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
    DisplayItemsOnSale(items);
    DisplayItemList();
    GetDataFromLocalStorage();
}

function DisplayCount() {
    let countContainer = document.querySelector("#count");
    let count = JSON.parse(localStorage.getItem("ItemCount"));
    if (count == 0 || count == null) {
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
                    <span class="position-absolute top-0 end-0 badge bg-danger m-2" id="saleBadge">Sale</span>
                    <img src="./images/placeholder.png" alt="" />
                    <div class="card-body text-center">
                        <h5 class="fw-bold">
                        ${items[i].name}
                        </h5>
                        <div class="d-flex justify-content-center">
                        <h5 class="text-muted m-3" id="price">$${items[i].price}</h5>
                        <h5 class="text-muted m-3" id="salePrice">$${items[i].salePrice}</h5>
                        </div>
                        <button class="btn btn-outline-dark"
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
                            <h5 class="modal-title fw-bold">${items[i].name}</h5>
                            <button class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid"src="./images/placeholder.png"/>
                            <h4 id="price-modal">$${items[i].price}</h4>
                            <h4 id="salePrice-modal">$${items[i].salePrice}</h4>
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
    let cartItems = GetDataFromLocalStorage();
    if (cartContainer) {
        // let cartObj = JSON.parse(localStorage.getItem("Cart"));
        // let cartItems = Object.values(cartObj);
        if (cartItems) {
            for (let i = 0; i < cartItems.length; i++) {
                /* cartContainer.innerHTML += `
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
                `; */
                cartContainer.innerHTML += `
                    <div id="cartItem" class="border border-1 rounded-3 shadow-sm my-3">
                    <div class="row row-cols-1 row-cols-md-1 row-cols-lg-6">
                    <img
                        class="img-fluid mb-sm-3 mb-lg-0"
                        src="./images/placeholder.png"
                        alt=""
                    />
                    <div
                        class="
                        h5
                        d-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <span>${cartItems[i].name}</span>
                    </div>
                    <div
                        class="
                        h5
                        d-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <span>Price:</span>
                        <span class="px-2">$${cartItems[i].price}</span>
                        <span class="px-2"></span>
                    </div>
                    <div
                        class="
                        fs-4
                        text-center
                        d-lg-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <span
                        class="btn-sm btn-outline-primary bi bi-caret-left"
                        id="minus"
                        style="font-size: 25px"
                        ></span>
                        <span class="px-1 fw-bold mx-2" id="counter">${cartItems[i].incart}</span>
                        <span
                        class="btn-sm btn-outline-primary bi bi-caret-right"
                        id="plus"
                        style="font-size: 25px"
                        ></span>
                    </div>
                    <div
                        class="
                        h5
                        d-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <span>Total:</span>
                        <span class="px-2">$${cartItems[i].price * cartItems[i].incart}</span>
                    </div>
                    <div
                        class="
                        d-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <button id="delete" class="btn btn-outline-danger bi-x-lg"></button>
                    </div>
                    </div>
                </div>
                `;
            }
            GetDeleteButtons();
            GetQuantityButtons();
            DisplayCount();
            CalculateTotal();
        } else {
            let btnlower = document.querySelector("#btnCheckout");
            btnlower.classList.add("d-none");
            cartContainer.innerHTML += `
            <div class="card p-5">
            <div class="card-body text-center">
            <h3 class="card-title display-3 fw-bold">Your cart is empty</h3>
            <p class="">You haven't added any items to your cart</p>
            <p
            class="bi-emoji-frown text-muted m-5"
            style="font-size: 125px"></p>
            <a class="btn btn-lg btn-outline-primary" href="products.html"
            >Go Shopping</a>
            </div>
            </div>
            `;
        }
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
    let cartItems = GetDataFromLocalStorage();
    let total = 0;

    if (cartItems) {
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].sale) {
                var cal = cartItems[i].salePrice * cartItems[i].incart;
                total += cal;
            } else {
                var cal = cartItems[i].price * cartItems[i].incart;
                total += cal;
            }
        }
    }

    return total;

    /* if (totalContainer != null) {
        if (cartItems.length == 0) {
            totalContainer.innerHTML = total;
        } else {
            for (let i = 0; i < cartItems.length; i++) {
                let cal = cartItems[i].price * cartItems[i].incart;
                total += cal;
                totalContainer.innerHTML = total;
            }
        }
    } */
}

function DisplayItemsOnSale(items) {
    let shopContainer = document.querySelector("#item-container")
    let saleBadge = document.querySelectorAll("#saleBadge");
    let price = document.querySelectorAll("#price");
    let salePrice = document.querySelectorAll("#salePrice");

    if (shopContainer) {
        for (var i = 0; i < items.length; i++) {

            if (!items[i].sale) {
                saleBadge[i].classList.add("d-none");
                salePrice[i].classList.add("d-none");
            } else {
                price[i].classList.add("text-decoration-line-through");
            }
        }
    } else {
        return;
    }
}

function DisplayItemList() {
    const itemCount = parseInt(localStorage.getItem("ItemCount"))
    const cartItems = GetDataFromLocalStorage();
    const total = CalculateTotal();

    let listGroup = document.querySelector("#listGroup");
    let listCounter = document.querySelector("#listCounter");

    if (listGroup && cartItems) {
        listCounter.innerHTML = itemCount;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].sale) {
                listGroup.innerHTML += `
                <li class="list-group-item bg-danger">
                <div class="row text-light">
                  <div class="col">${cartItems[i].name}</div>
                  <div class="col-auto">x${cartItems[i].incart}</div>
                  <div class="col col-3 text-center">$${cartItems[i].salePrice * cartItems[i].incart}</div>
                </div>
                </li>
                `;
            } else {
                listGroup.innerHTML += `
                <li class="list-group-item">
                <div class="row">
                  <div class="col">${cartItems[i].name}</div>
                  <div class="col-auto">x${cartItems[i].incart}</div>
                  <div class="col col-3 text-center">$${cartItems[i].price * cartItems[i].incart}</div>
                </div>
                </li>
                `;
            }
        }
        listGroup.innerHTML += `
        <li class="
          list-group-item
          d-flex
          justify-content-between
          fw-bold
          fs-5
          bg-light
        ">
            <div class="text-success">Total</div>
            <div class="text-success px-2 px-sm-4 px-md-1 px-lg-3 px-xl-4">$${total}</div>
        </li>
        `;
    } else {
        return;
    }
}

function GetDataFromLocalStorage() {
    let cartObj = JSON.parse(localStorage.getItem("Cart"));
    if (cartObj) {
        return Object.values(cartObj);
    } else {
        return false;
    }
}

Main();