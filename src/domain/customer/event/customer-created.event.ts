import EventInterface from "../../@shared/event/event.interface";

type CustomerCreatedEventData = {
  customer_id: string;
  customer_name: string;
}

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerCreatedEventData;

  constructor(eventData: CustomerCreatedEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
