import 'reflect-metadata'
import { Container } from "inversify";
import TYPES from './types'

import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import { UserRepo } from '@/repos/user.repo';

const container = new Container();

container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo).inSingletonScope();

export default container;