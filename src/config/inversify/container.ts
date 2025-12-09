import 'reflect-metadata'
import { Container } from "inversify";
import TYPES from './types'
import Redis from 'ioredis';
import redis from '@/config/redis'

import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import { UserRepo } from '@/repos/user.repo';
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';
import { BcryptPasswordHasher } from '@/providers/PasswordHasher';
import { ITokenProvider } from '@/providers/interfaces/TokenProvider.interface';
import { JwtTokenProvider } from '@/providers/TokenProvider';
import { ICacheProvider } from '@/providers/interfaces/CacheProvider.interface';
import { RedisCacheProvider } from '@/providers/RedisCacheProvider';

const container = new Container();

container.bind<Redis>(TYPES.Redis).toConstantValue(redis);

/**
 * Providers
 */
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher).inSingletonScope();
container.bind<ITokenProvider>(TYPES.ITokenProvider).to(JwtTokenProvider).inSingletonScope();
container.bind<ICacheProvider>(TYPES.ICacheProvider).to(RedisCacheProvider).inSingletonScope();

/**
 * Repos
 */
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo).inSingletonScope();



export default container;