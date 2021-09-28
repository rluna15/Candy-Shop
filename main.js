async function GetProductsJSON() {
    let url = "products.json";
    try {
        let res = await fetch(url);
        let data = await res.json();
        return data;
    } catch (error) {
        console.log("Json file was not found",error);
    }
}

async function Main() {
    let items = await GetProductsJSON();
    CreateShop(items);
    CreateCart();
    DisplayCount();
    DisplayItemList();
    GetDataFromLocalStorage();
    OrderValidation();
    DisplayBilling();
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
                    <img src="./images/${items[i].image}.jpg" alt="" />
                    <div class="card-body text-center">
                        <h5 class="fw-bold">
                        ${FormatName(items[i].name)}
                        </h5>
                        <div class="d-flex justify-content-center">
                        <h5 class="m-3" id="price">$${items[i].price}</h5>
                        <h5 class="m-3" id="salePrice">$${items[i].salePrice}</h5>
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
                            <h5 class="modal-title fw-bold">${FormatName(items[i].name)}</h5>
                            <button class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid"src="./images/${items[i].image}.jpg"/>
                            <p>${items[i].info}</p>
                            <div class="">
                            <h4 class="d-inline" id="price-modal">$${items[i].price}</h4>
                            <h4 class="d-inline" id="salePrice-modal">$${items[i].salePrice}</h4>
                            </div>
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
    DisplayItemsOnSale(items);
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

        if (cartItems.length > 0) {
            
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i].sale) {
                    cartContainer.innerHTML += `
                    <div id="cartItem" class="border border-1 rounded-3 shadow-sm my-3">
                    <div class="row row-cols-1 row-cols-md-1 row-cols-lg-6">
                    <img
                        class="img-fluid mb-sm-3 mb-lg-0"
                        src="./images/${cartItems[i].image}.jpg"
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
                        <span>${FormatName(cartItems[i].name)}</span>
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
                        <s class="px-2">$${cartItems[i].price}</s>
                        <span class="px-2">$${cartItems[i].salePrice}</span>
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
                        <span class="px-2">$${cartItems[i].salePrice * cartItems[i].incart}</span>
                    </div>
                    <div
                        class="
                        d-flex
                        justify-content-center
                        align-items-center
                        mb-sm-3 mb-lg-0
                        "
                    >
                        <button id="delete" class="btn btn-outline-danger bi-x-lg mb-3 mb-sm-0"></button>
                    </div>
                </div>
                `;
                } else {
                    cartContainer.innerHTML += `
                    <div id="cartItem" class="border border-1 rounded-3 shadow-sm my-3">
                    <div class="row row-cols-1 row-cols-md-1 row-cols-lg-6">
                        <img
                        class="img-fluid mb-sm-3 mb-lg-0"
                        src="./images/${cartItems[i].image}.jpg"
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
                        <span>${FormatName(cartItems[i].name)}</span>
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
                        class="d-flex justify-content-center align-items-center mb-sm-3 mb-lg-0"
                        >
                        <button id="delete" class="btn btn-outline-danger bi-x-lg mb-3 mb-sm-0"></button>
                        </div>
                    </div>

                `;
                }
            }
            DisplayTotal();
            GetDeleteButtons();
            GetQuantityButtons();
            DisplayCount();
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

function DisplayTotal() {
    console.log("made it to display total");
    let cartContainer = document.querySelector("#cart-container");
    cartContainer.innerHTML += `
            <div class="d-flex justify-content-end my-4">
                <h3 class="px-4">Total: $${CalculateTotal()}</h3>
            </div>
            `;
}

function GetDeleteButtons() {
    let deleteButtons = document.querySelectorAll("#delete");

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function () {
            RemoveFromCart(i);
            UpdateItemCount(i);
        });
    }
}

function RemoveFromCart(i) {
    let cartItems = GetDataFromLocalStorage();
    cartItems.splice(i, 1);

    localStorage.setItem("Cart", JSON.stringify(cartItems));
    location.reload();
}

function UpdateItemCount(i) {
    let itemCount = JSON.parse(localStorage.getItem("ItemCount"));
    let counters = document.querySelectorAll("#counter");

    if (itemCount > 0) {
        itemCount -= counters[i].innerHTML;
    } else {
        return;
    }


    localStorage.setItem("ItemCount", JSON.stringify(itemCount));
}

function GetQuantityButtons() {
    let minus = document.querySelectorAll("#minus");
    let plus = document.querySelectorAll("#plus");

    for (let i = 0; i < minus.length; i++) {
        minus[i].addEventListener("click", function () {
            SubtractFromCount(i);
        })
    }

    for (let i = 0; i < plus.length; i++) {
        plus[i].addEventListener("click", function () {
            AddToCount(i);
        })
    }
}

function AddToCount(i) {
    let cartItems = GetDataFromLocalStorage();
    let itemCount = parseInt(localStorage.getItem("ItemCount"));
    cartItems[i].incart += 1;
    localStorage.setItem("ItemCount", itemCount + 1);
    localStorage.setItem("Cart", JSON.stringify(cartItems));

    location.reload();
}

function SubtractFromCount(i) {
    let cartItems = GetDataFromLocalStorage();
    let itemCount = parseInt(localStorage.getItem("ItemCount"));

    if (cartItems[i].incart == 1) {
        return;
    } else {
        cartItems[i].incart -= 1;
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
}

function DisplayItemsOnSale(items) {
    let shopContainer = document.querySelector("#item-container")
    let saleBadge = document.querySelectorAll("#saleBadge");
    let price = document.querySelectorAll("#price");
    let salePrice = document.querySelectorAll("#salePrice");
    let priceModal = document.querySelectorAll("#price-modal");
    let salePriceModal = document.querySelectorAll("#salePrice-modal");

    if (shopContainer) {
        for (var i = 0; i < items.length; i++) {

            if (!items[i].sale) {
                saleBadge[i].classList.add("d-none");
                salePrice[i].classList.add("d-none");
                salePriceModal[i].classList.add("d-none")
            } else {
                price[i].classList.add("text-decoration-line-through");
                priceModal[i].classList.add("text-decoration-line-through");
                priceModal[i].classList.add("text-muted");
                price[i].classList.add("text-muted");
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

function OrderValidation() {
    let submit = document.querySelector("#submitBtn");
    if (submit != undefined) {
        submit.addEventListener("click", (evt) => {

            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }

            let firstName = document.forms["orderForm"]["firstName"].value;
            let lastName = document.forms["orderForm"]["lastName"].value;
            let address = document.forms["orderForm"]["address"].value;
            let email = document.forms["orderForm"]["email"].value;
            let state = document.forms["orderForm"]["state"].value;
            let zip = document.forms["orderForm"]["zip"].value;
            let nameOnCard = document.forms["orderForm"]["nameOnCard"].value;
            let cardNumber = document.forms["orderForm"]["cardNumber"].value;
            let expDate = document.forms["orderForm"]["expDate"].value;
            let cvv = document.forms["orderForm"]["cvv"].value;

            let textPattern = /^[a-zA-z ]*$/;
            let addressPattern = /\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?/;
            let emailPattern = /^[_a-zA-Z0-9\\-]+(\.[_a-zA-Z0-9\\-]+)*@[a-zA-Z0-9\\-]+(\.[a-zA-Z0-9\\-]+)*(\.[a-z]{2,6})$/;
            let statePattern = /AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY/;
            let zipPattern = /\b\d{5}(?:-\d{4})?\b/;
            let cardNumberPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
            let expDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
            let cvvPattern = /\d{3}/;

            let errorMsg = document.querySelectorAll(".invalid-feedback");
            let formValid;

            if (textPattern.test(firstName) && firstName != "") {
                console.log("First Name:", "ok");
                errorMsg[0].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("First Name:", "not ok");
                errorMsg[0].classList.add("d-block");
                formValid = false;
            }
            if (textPattern.test(lastName) && lastName != "") {
                console.log("Last Name:", "ok");
                errorMsg[1].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Last Name:", "not ok");
                errorMsg[1].classList.add("d-block");
                formValid = false;
            }
            if (addressPattern.test(address) && address != "") {
                console.log("Address:", "ok");
                errorMsg[2].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Address:", "not ok");
                errorMsg[2].classList.add("d-block");
                formValid = false;
            }
            if (emailPattern.test(email) && email != "") {
                console.log("Email:", "ok");
                errorMsg[3].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Email:", "not ok");
                errorMsg[3].classList.add("d-block");
                formValid = false;
            }
            if (statePattern.test(state) && state != "") {
                console.log("State:", "ok");
                errorMsg[4].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("State:", "not ok");
                errorMsg[4].classList.add("d-block");
                formValid = false;
            }
            if (zipPattern.test(zip) && zip != "") {
                console.log("Zip:", "ok");
                errorMsg[4].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Zip:", "not ok");
                errorMsg[5].classList.add("d-block");
                formValid = false;
            }
            if (textPattern.test(nameOnCard) && nameOnCard != "") {
                console.log("Name on Card:", "ok");
                errorMsg[6].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Name on Card:", "not ok");
                errorMsg[6].classList.add("d-block");
                formValid = false;
            }
            if (cardNumberPattern.test(cardNumber) && cardNumber != "") {
                console.log("Card Number:", "ok");
                errorMsg[7].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Card Number:", "not ok");
                errorMsg[7].classList.add("d-block");
                formValid = false;
            }
            if (expDatePattern.test(expDate) && expDate != "") {
                console.log("Exp Date:", "ok");
                errorMsg[8].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("Exp Date:", "not ok");
                errorMsg[8].classList.add("d-block");
                formValid = false;
            }
            if (cvvPattern.test(cvv) && cvv != "") {
                console.log("CVV:", "ok");
                errorMsg[9].classList.remove("d-block");
                formValid = true;
            } else {
                console.log("CVV:", "not ok");
                errorMsg[9].classList.add("d-block");
                formValid = false;
            }
            //this is here to testing and demo of the form validation
            formValid = true;

            if (formValid) {
                SubmitForm();
            }
        });
    } else {
        return;
    }
}

function SubmitForm() {
    let elements = document.forms["orderForm"].elements;
    let items = GetDataFromLocalStorage();
    let billing = {
        name: "",
        address: "",
        email: "",
        country: "",
        state: "",
        zip: "",
        cardNumber: "",
        items: []
    };
    billing.name = elements[0].value + " " + elements[1].value;
    billing.address = elements[2].value;
    billing.email = elements[3].value;
    billing.country = elements[4].value;
    billing.state = elements[5].value;
    billing.zip = elements[6].value;
    billing.cardNumber = elements[8].value;
    billing.items = items;


    console.log(billing);
    localStorage.setItem("Billing", JSON.stringify(billing));
    window.location.href = "./order.html";
}

function RemoveDataFromStorage() {
    localStorage.removeItem("Cart");
    localStorage.removeItem("ItemCount");
    localStorage.removeItem("Billing");
}

function DisplayBilling() {
    let orderDetails = document.querySelector("#orderDetails");


    if (orderDetails != undefined) {
        let billing = JSON.parse(localStorage.getItem("Billing"));
        let count = document.querySelector("#count");
        count.innerHTML = '';
        orderDetails.innerHTML = `
        <p class="fw-bold">
            Name: <span class="fw-normal">${billing.name}</span>
        </p>
        <p class="fw-bold">
            Address: <span class="fw-normal">
                ${billing.address} ${billing.state} ${billing.zip} 
            </span>
        </p>
        <p class="fw-bold">
            Email: <span class="fw-normal">${billing.email}</span>
        </p>
        <p class="fw-bold">
            Card Number: <span class="fw-normal">${billing.cardNumber}</span>
        </p>
        `;
        for (let i = 0; i < billing.items.length; i++) {
            if (billing.items[i].sale) {
                orderDetails.innerHTML += `
                    <hr>
                    <p>
                    ${billing.items[i].name} 
                    <br>Price: <del>$${billing.items[i].price}</del>
                    <span class="text-danger">$${billing.items[i].salePrice}</span>
                    <br>Quantity: ${billing.items[i].incart}
                    <br>$${billing.items[i].salePrice * billing.items[i].incart}
                    </p>
                `;
            } else {
                orderDetails.innerHTML += `
                <hr>
                <p>
                ${billing.items[i].name} 
                <br>Price: $${billing.items[i].price}
                <br>Quantity: ${billing.items[i].incart}
                <br>$${billing.items[i].price * billing.items[i].incart}
                </p>
                `;
            }
        }
        const total = CalculateTotal();
        orderDetails.innerHTML += `
        <hr>
        <p class="fw-bold">Total: $${total}</p>
        `;
    } else {
        return;
    }
    RemoveDataFromStorage();
}

function FormatName(name) {
    return name.replace("-", " ");
}

Main();