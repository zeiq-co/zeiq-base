import helpers from './helpers';
import libs from './libs';
import auth from './auth';
import hooks from './hooks';

// export const Helpers = helpers;
// export const Libs = libs;
// export const Auth = auth;

export default { ...helpers, ...libs, ...auth, ...hooks };
