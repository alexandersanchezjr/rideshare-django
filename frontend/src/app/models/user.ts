export class User {
  constructor(
    public id: number,
    public username: string,
    public firstname: string,
    public lastname: string,
    private group: UserGroup,
    public photo: string,
    public password?: string,
  ) {}

  get isDriver(): boolean {
    return this.group === UserGroup.DRIVER;
  }

  get isRider(): boolean {
    return this.group === UserGroup.RIDER;
  }
}

export const enum UserGroup {
  RIDER = 'rider',
  DRIVER = 'driver',
}
