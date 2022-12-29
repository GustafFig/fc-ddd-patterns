import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "./send-console-log1-when-customer-is-created.handler";

describe("SendConsoleLogWhenCustomerIsCreatedHandler unit tests", () => {
  it("should send console.log", () => {
    const handler = new SendConsoleLog1WhenCustomerIsCreatedHandler();

    const consoleLogSpy = jest.spyOn(console, "log");

    const eventDispatcher = new EventDispatcher();
    eventDispatcher.register("CustomerCreatedEvent", handler);

    const event = new CustomerCreatedEvent({
      customer_id: "1",
      customer_name: "John",
    });
    eventDispatcher.notify(event);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
  });
});
