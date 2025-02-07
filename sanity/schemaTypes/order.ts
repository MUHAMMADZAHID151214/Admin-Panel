const orderSchema = {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
      { name: "firstName", title: "First Name", type: "string" },
      { name: "lastName", title: "Last Name", type: "string" },
      { name: "address", title: "Address", type: "string" },
      { name: "country", title: "Country", type: "string" },
      { name: "city", title: "City", type: "string" },
      { name: "zip", title: "Zip Code", type: "string" },
      { name: "email", title: "Email", type: "string" },
      { name: "price", title: "Total Price", type: "number" },
      {name: "phone", title: "Phone No", type: "number"},
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [{ type: "reference", to: [{ type: "product" }] }],
      },
  
      {
        name: "orderStatus",
        title: "Order Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Processing", value: "processing" },
            { title: "Shipped", value: "shipped" },
            { title: "Delivered", value: "delivered" },
            { title: "Cancelled", value: "cancelled" },
          ],
          layout: "radio",
        },
        initialValue: "pending",
      },
    ],
  };
  
  export default orderSchema;
  