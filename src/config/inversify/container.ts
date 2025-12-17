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
import { IBookingRepo } from '@/repos/interfaces/booking.repo.interface';
import { BookingRepo } from '@/repos/booking.repo';
import { IServiceService } from '@/services/interfaces/service.service.interface';
import { ServiceService } from '@/services/service.service';
import { IBookingService } from '@/services/interfaces/booking.service.interface';
import { BookingService } from '@/services/booking.service';
import { ICategoryRepo } from '@/repos/interfaces/category.repo.interface';
import { CategoryRepo } from '@/repos/category.repo';
import { ICategoryService } from '@/services/interfaces/category.service.interface';
import { CategoryService } from '@/services/category.service';

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
container.bind<IBookingRepo>(TYPES.IBookingRepo).to(BookingRepo).inSingletonScope();
container.bind<ICategoryRepo>(TYPES.ICategoryRepo).to(CategoryRepo).inSingletonScope();

/**
 * Services
 */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IProfileService>(TYPES.IProfileService).to(ProfileService).inSingletonScope();
container.bind<IServiceService>(TYPES.IServiceService).to(ServiceService).inSingletonScope();
container.bind<IBookingService>(TYPES.IBookingService).to(BookingService).inSingletonScope();
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inSingletonScope();



export default container;

