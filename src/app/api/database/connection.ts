"use node"
import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "./scema/user.entity";


const DB = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [User],
});

if(!DB.isInitialized){
  await DB.initialize();
}

export default DB;
