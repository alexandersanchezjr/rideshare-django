export class User {
  public id?: number;
  public username?: string;
  public firstname?: string;
  public lastname?: string;
  public group?: UserGroup;
  public photo?: string;
  public password?: string;

  constructor(userResponse: Partial<UserResponse>) {
    this.id = userResponse.id;
    this.username = userResponse.username;
    this.firstname = userResponse.first_name;
    this.lastname = userResponse.last_name;
    this.group = userResponse.group === UserGroup.DRIVER ? UserGroup.DRIVER : UserGroup.RIDER;
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
  token_type: string
  exp: number
  iat: number
  jti: string
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  group: string,
  password: string
}
