import EventInterface from "../../@shared/event/event.interface";

type CustomerChangedAddressEventData = {
  customer_id: string;
  customer_name: string;
  address: string;
}

export default class CustomerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerChangedAddressEventData;

  constructor(eventData: CustomerChangedAddressEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
