import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogWhenCustomerChangeAddressHandler
  implements EventHandlerInterface {
    handle({ eventData }: CustomerChangedAddressEvent) {
      const { customer_id, customer_name, address } = eventData;
      console.log(
        `Endereço do cliente ${customer_id} ${customer_name} alterado para: ${address}`,
      )
    }
  }
