import { User, UserResponse } from './user';

export class Trip {

  public id: string;
  public created: string;
  public updated: string;
  public pickUpAddress: string;
  public dropOffAddress: string;
  public status: Status;
  public driver: User;
  public rider: User;

  constructor (tripResponse: TripResponse) {
    this.id = tripResponse.id;
    this.created = tripResponse.created;
    this.updated = tripResponse.updated;
    this.pickUpAddress = tripResponse.pickUpAddress;
    this.dropOffAddress = tripResponse.dropOffAddress;
    this.status = tripResponse.status as Status;
    this.driver = new User(tripResponse.driver);
    this.rider = new User(tripResponse.rider);
  }
}

export enum Status {
  REQUESTED = 'REQUESTED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type TripResponse = {
  id: string;
  created: string;
  updated: string;
  pickUpAddress: string;
  dropOffAddress: string;
  status: string;
  driver: UserResponse;
  rider: UserResponse;
}
