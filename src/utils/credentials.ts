import * as dotenv from "dotenv";
dotenv.config();

export enum UserType {
  CUSTOMER_USER = 'CUSTOMER_USER',
  MANAGER_USER = 'MANAGER_USER',
  NO_USER = 'NO_USER'
}

export const userCredentials = {
  [UserType.CUSTOMER_USER]: {
    email: 'peterc@test.com',
    username: 'Peter Crouch',
    password: process.env.CUSTOMER_PASS || ""
  },
  [UserType.MANAGER_USER]: {
    email: '',
    username: '',
    password: process.env.MANAGER_PASS || ""
  },
  [UserType.NO_USER]: {
    email: '',
    username: '',
    password: ''
  }
};