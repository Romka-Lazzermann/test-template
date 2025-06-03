import { container } from 'tsyringe';
import { BlogService } from './services/BlogService';
import { UserService } from './services/UseService';

container.register(BlogService, { useClass: BlogService });
container.register(UserService, { useClass: UserService })