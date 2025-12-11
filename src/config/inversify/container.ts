import 'reflect-metadata'
import { Container } from "inversify";
import TYPES from './types'
import Redis from 'ioredis';
import redis from '@/config/redis'

import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import { UserRepo } from '@/repos/user.repo';
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';
import { BcryptPasswordHasher } from '@/providers/passwordHasher';
import { ITokenProvider } from '@/providers/interfaces/tokenProvider.interface';
import { JwtTokenProvider } from '@/providers/tokenProvider';
import { ICacheProvider } from '@/providers/interfaces/cacheProvider.interface';
import { RedisCacheProvider } from '@/providers/redisCacheProvider';
import { IAuthService } from '@/services/interfaces/auth.service.interface';
import { AuthService } from '@/services/auth.service';
import { IProfileService } from '@/services/interfaces/profile.service.interface';
import { ProfileService } from '@/services/profile.service';
import { IServiceRepo } from '@/repos/interfaces/service.repo.interface';
import { ServiceRepo } from '@/repos/service.repo';

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
container.bind<IServiceRepo>(TYPES.IServiceRepo).to(ServiceRepo).inSingletonScope();

/**
 * Services
 */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IProfileService>(TYPES.IProfileService).to(ProfileService).inSingletonScope();

export default container;

