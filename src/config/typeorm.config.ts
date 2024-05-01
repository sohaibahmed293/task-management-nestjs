import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'task_manager',
    entities: ['dist/src/**/*.entity{.ts,.js}'],
    synchronize: true,
    autoLoadEntities: true,
}