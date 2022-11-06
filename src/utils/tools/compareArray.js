export const objectsEqual = (o1, o2) => {

    console.log("o1: ", o1);


    console.log("o2: ", o2);


    return Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p]);
}

export const findLatestOrderID = (orders) => {

    const res = Math.max.apply(Math, orders.map(function(o) { return o.orderID; }))

    return res

}