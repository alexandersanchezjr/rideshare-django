import { User, UserResponse } from './user';

export class Trip {

  public id?: string;
  public created?: string;
  public updated?: string;
  public pickUpAddress: string;
  public dropOffAddress: string;
  public status?: Status;
  public driver?: User;
  public rider?: User;

  constructor (tripResponse: Partial<TripResponse>) {
    this.id = tripResponse.id;
    this.created = tripResponse.created;
    this.updated = tripResponse.updated;
    this.pickUpAddress = tripResponse.pick_up_address!;
    this.dropOffAddress = tripResponse.drop_off_address!;
    this.status = tripResponse.status as Status;
    this.driver = tripResponse.driver ? new User(tripResponse.driver) : undefined;
    this.rider = tripResponse.rider ? new User(tripResponse.rider) : undefined;
  }

  get otherUser(): User {
    return this.driver ? this.driver : this.rider!;
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
  pick_up_address: string;
  drop_off_address: string;
  status: string;
  driver: Partial<UserResponse>;
  rider: Partial<UserResponse>;
}

export type TripMessage = {
  type: string;
  data: TripDataMessage;
}

export type TripDataMessage = {
  id?: string;
  pick_up_address: string;
  drop_off_address: string;
  status?: Status;
  driver?: number;
  rider?: number;
}
