export interface PersonData {
  name: string;
  username: string;
  email: string;
  image: string;
}

export interface Person extends PersonData {
  _id: string;
}
