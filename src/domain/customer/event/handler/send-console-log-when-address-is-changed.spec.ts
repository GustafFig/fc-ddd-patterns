import EventDispatcher from "../../../@shared/event/event-dispatcher";
import Address from "../../value-object/address";
import CustomerChangedAddressEvent from "../customer-changed-address.event";
import SendConsoleLogWhenCustomerChangeAddressHandler from "./send-console-log-when-customer-change-address";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "./send-console-log2-when-customer-is-created.handler";

describe("SendConsoleLogWhenCustomerIsCreatedHandler unit tests", () => {
  it("should send console.log", () => {
    const handler = new SendConsoleLogWhenCustomerChangeAddressHandler();

    const consoleLogSpy = jest.spyOn(console, "log");

    const eventDispatcher = new EventDispatcher();
    eventDispatcher.register("CustomerChangedAddressEvent", handler);

    const address = new Address("Street 1", 123, "City 1", "State 1");
    const event = new CustomerChangedAddressEvent({
      customer_id: "1",
      customer_name: "John",
      address: address.toString(),
    });
    eventDispatcher.notify(event);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Endereço do cliente 1 John alterado para: Street 1, 123, City 1 State 1"
    );
  });
});
