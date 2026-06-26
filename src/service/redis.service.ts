import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { createClient, RedisArgument, RedisClientType } from 'redis';
import { emailEnum } from '../common/enum/email.enum';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly client: RedisClientType;
    private isConnected = false;
    private hasLoggedConnectionError = false;

    constructor(private readonly configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL');
        const redisHost = this.configService.get<string>('REDIS_HOST');
        const redisPort = Number(this.configService.get<string>('REDIS_PORT'));
        const redisUsername = this.configService.get<string>('REDIS_USERNAME');
        const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

        this.client = redisUrl
        ? createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: false,
            }
        })
        : createClient({
            username: redisUsername,
            password: redisPassword,
            socket: {
                host: redisHost,
                port: Number.isNaN(redisPort) ? undefined : redisPort,
                reconnectStrategy: false,
            }
        });

        this.handleEvent();
    }

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        if (!this.isConnected) {
            return;
        }

        await this.client.quit();
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) {
            return;
        }

        const redisUrl = this.configService.get<string>('REDIS_URL');
        const redisHost = this.configService.get<string>('REDIS_HOST');
        const redisPort = Number(this.configService.get<string>('REDIS_PORT'));

        if (!redisUrl && (!redisHost || Number.isNaN(redisPort))) {
            return;
        }

        try {
            await this.client.connect();
            this.isConnected = true;
            console.log('Connected to Redis successfully!');
        } catch (error) {
            this.isConnected = false;
            this.logConnectionError(error);
        }
    }

    handleEvent() {
        this.client.on('error', (error) => {
            this.logConnectionError(error);
        });
    }

    private logConnectionError(error: any) {
        if (this.hasLoggedConnectionError) {
            return;
        }

        this.hasLoggedConnectionError = true;
        console.error('Redis connection error:', error);
    }

    async set({
        key,
        value,
        expire,
    }: {
        key: RedisArgument;
        value: RedisArgument;
        expire?: number;
    }) {
        await this.connect();
        if (!this.isConnected) {
            return;
        }

        if (expire) {
            await this.client.set(key, value, { EX: expire });
        } else {
            await this.client.set(key, value);
        }
    }

    async get({ key }: { key: RedisArgument }) {
        await this.connect();
        if (!this.isConnected) {
            return null;
        }

        return await this.client.get(key);
    }

    async del({ key }: { key: RedisArgument }) {
        await this.connect();
        if (!this.isConnected) {
            return;
        }

        await this.client.del(key);
    }

    async setOtp({
        email,
        otp,
        types,
    }: {
        email: string;
        otp: string | number;
        types: emailEnum;
    }) {
        const key = `otp:${types}:${email}`;
        await this.set({ key, value: String(otp), expire: 300 }); // 5 minutes expiration
    }

    async getOtp({
        email,
        types,
    }: {
        email: string;
        types: emailEnum;
    }) {
        const key = `otp:${types}:${email}`;
        return await this.get({ key });
    }

    async deleteOtp({
        email,
        types,
    }: {
        email: string;
        types: emailEnum;
    }) {
        const key = `otp:${types}:${email}`;
        await this.del({ key });
    }
}