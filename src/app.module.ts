import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.modules';
import { ProductModule } from './modules/product/product.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI') || configService.get<string>('DB_URI');

        if (!mongoUri) {
          throw new Error('MONGO_URI or DB_URI must be defined');
        }

        return {
          uri: mongoUri,
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => console.log('connected to db success....'));
            return connection;
          },
        };
      },
    }),

    UserModule,
    ProductModule,
    BrandModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
