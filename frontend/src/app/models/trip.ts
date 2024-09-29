import { User } from './user';

export class Trip {
  constructor (
    public id: string,
    public created: string,
    public updated: string,
    public pickUpAddress: string,
    public dropOffAddress: string,
    public status: Status,
    public driver: User,
    public rider: User,
  ) {}
}

const enum Status {
  REQUESTED = 'REQUESTED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
