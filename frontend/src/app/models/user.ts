export class User {
  constructor(
    public id: number,
    public username: string,
    public first_name: string,
    public last_name: string,
    private group: UserGroup,
    public photo: string,
  ) {}

  get isDriver(): boolean {
    return this.group === UserGroup.DRIVER;
  }

  get isRider(): boolean {
    return this.group === UserGroup.RIDER;
  }
}

const enum UserGroup {
  RIDER = 'rider',
  DRIVER = 'driver',
}
