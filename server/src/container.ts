import { container } from 'tsyringe';
import { BlogService } from './services/BlogService';
import { UserService } from './services/UseService';
import { CategoryService } from './services/CategoryService'
import { ChannelService } from './services/ChannelService'
import { StyleService } from './services/StyleService'


container.register(BlogService, { useClass: BlogService });
container.register(UserService, { useClass: UserService });
container.register(CategoryService, { useClass: CategoryService });
container.register(ChannelService, { useClass: ChannelService });
container.register(StyleService, { useClass: StyleService });
