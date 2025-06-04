import { container } from 'tsyringe';
import { BlogService } from './services/BlogService';
import { UserService } from './services/UseService';
import { CategoryService } from './services/CategoryService'

container.register(BlogService, { useClass: BlogService });
container.register(UserService, { useClass: UserService });
container.register(CategoryService, { useClass: CategoryService });