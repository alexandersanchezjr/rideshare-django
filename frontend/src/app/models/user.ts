export class User {
  public id: number;
  public username: string;
  public firstname: string;
  public lastname: string;
  public group: UserGroup;
  public photo: string;
  public password?: string;

  constructor(userResponse: UserResponse) {
    this.id = userResponse.id;
    this.username = userResponse.username;
    this.firstname = userResponse.firstname;
    this.lastname = userResponse.lastname;
    this.group = userResponse.group === UserGroup.DRIVER ? UserGroup.DRIVER : UserGroup.RIDER;
    this.photo = userResponse.photo;
    this.password = userResponse.password
  }

  get isDriver(): boolean {
    return this.group === UserGroup.DRIVER;
  }

  get isRider(): boolean {
    return this.group === UserGroup.RIDER;
  }
}

export enum UserGroup {
  RIDER = 'rider',
  DRIVER = 'driver',
}

export type UserResponse = {
  id: number,
  username: string,
  firstname: string,
  lastname: string,
  group: string,
  photo: string,
  password?: string
}
