import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../users/entity/users.entity";
import { Tokens } from "../auth/entity/tokens.entity";

export default (): TypeOrmModuleOptions => ({
 type: 'mysql',
 host: process.env.DATA_HOST,
 port: Number(process.env.DATA_PORT),
 username: process.env.DATA_USERNAME,
 password: process.env.DATA_PASSWORD,
 database: process.env.DATA_DATABASE,
 entities: [
   User,
   Tokens
 ],
 entityPrefix: 'Megak_',
 // synchronize: true,
});
