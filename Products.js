export function Products() {
    //Required fields: name, price, incart ex.(name: "Apple", price: 30, incart: 0)
    var items = [
        {
            name: "Apple",
            price: 100,
            incart: 0,
            info: "Apple phone are amazing."
        },
        {
            name: "Google",
            price: 200,
            incart: 0,
            info: "Google is cool."
        },
        {
            name: "Android",
            price: 140,
            incart: 0,
        },
        {
            name: "Samsung",
            price: 90,
            incart: 0,
        }
    ];
    return items;
}