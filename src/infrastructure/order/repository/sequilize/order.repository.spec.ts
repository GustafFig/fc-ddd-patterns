import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

const createCustomer = async () => {
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  const customerRepository = new CustomerRepository();
  await customerRepository.create(customer);
  return customer;
};

const createProduct = async  () => {
  const product = new Product("123", "Product 1", 10);
  const productRepository = new ProductRepository();
  await productRepository.create(product);
  return product;
};

const createDependencies = async (): Promise<{
  customer: Customer;
  product: Product;
  ordemItem: OrderItem;
}> => {
  const customer = await createCustomer();
  const product = await createProduct();
  const ordemItem = new OrderItem(
    "1",
    product.name,
    product.price,
    product.id,
    2
  );
  return { customer, product, ordemItem };
};

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const { customer, ordemItem } = await createDependencies();

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it.todo(
    "should be not possible to create an order with a non-existent customer"
  );

  it.todo(
    "should be not possible to create an order with a non-existent product"
  );

  it("should add item on update", async () => {
    const { customer, ordemItem } = await createDependencies();

    const order = new Order("123", "123", [ordemItem]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    const orderAttrs = {
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
    };
    const item1Attrs = {
      id: ordemItem.id,
      name: ordemItem.name,
      price: ordemItem.price,
      quantity: ordemItem.quantity,
      order_id: order.id,
      product_id: ordemItem.productId,
    };
    expect(orderModel.toJSON()).toStrictEqual({
      ...orderAttrs,
      items: [item1Attrs],
    });

    const product2 = new Product("456", "Product 2", 20);
    const productRepository = new ProductRepository();
    await productRepository.create(product2);
    const ordemItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    order.addItem(ordemItem2);
    await orderRepository.update(order);

    const orderModelUpdated = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
      order: [["items", "id", "ASC"]],
    });
    expect(orderModelUpdated.items.length).toBe(2);
    expect(orderModelUpdated.toJSON()).toStrictEqual({
      ...orderAttrs,
      total: order.total(),
      items: [
        item1Attrs,
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: ordemItem2.quantity,
          order_id: order.id,
          product_id: ordemItem2.productId,
        },
      ],
    });
  });

  it("should find an order", async () => {
    const { ordemItem } = await createDependencies();
    const orderRepository = new OrderRepository();
    const order = new Order("123", "123", [ordemItem])
    await orderRepository.create(order);

    const dbOrder = await orderRepository.find(order.id);
    expect(dbOrder).toStrictEqual(order);
  });

  it("should throw an error when customer is not found", async () => {
    const orderRepository = new OrderRepository();

    await expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found");
  });
});
