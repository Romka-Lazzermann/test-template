import { container } from 'tsyringe';
import { BlogService } from './services/BlogService';
import { UserService } from './services/UseService';
import { CategoryService } from './services/CategoryService'
import { ChannelService } from './services/ChannelService'
import { StyleService } from './services/StyleService'
import { CombinationService } from './services/CombinationService'
import { LinksService } from './services/LinksService'
import { AIPromtService } from './services/AIPromtService'
import { ImpressionService } from './services/ImpressionService'
import { GoogleService } from './services/GoogleService'


container.register(BlogService, { useClass: BlogService });
container.register(UserService, { useClass: UserService });
container.register(CategoryService, { useClass: CategoryService });
container.register(ChannelService, { useClass: ChannelService });
container.register(StyleService, { useClass: StyleService });
container.register(CombinationService, { useClass: CombinationService })
container.register(LinksService, { useClass: LinksService })
container.register(AIPromtService, { useClass: AIPromtService })
container.register(ImpressionService, { useClass: ImpressionService })
container.register(GoogleService, { useClass: GoogleService })