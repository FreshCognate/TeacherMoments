import registerRoutes from '#core/app/helpers/registerRoutes.js';

import routes from './authentication.routes.js';
import signupRoutes from './signup.routes.js';

registerRoutes(routes);
registerRoutes(signupRoutes);