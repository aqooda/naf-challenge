import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.development', '.env.production'],
      isGlobal: true,
    }),
    RequestsModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        return {
          type: 'better-sqlite3',
          database: './database.db',
          synchronize: isDevelopment,
          autoLoadEntities: true,
          logging: isDevelopment,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
