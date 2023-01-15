import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

import CONFIG from '@config';

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: 'mysql',
  dialectModule: mysql2,
  port: CONFIG.db_port,
  pool: {
    /**
     * Pool configuration following:
     * https://sequelize.org/master/manual/aws-lambda.html
     */
    max: 2,
    min: 0,
    idle: 0,
    acquire: 3000,
    evict: 60000, // CURRENT_LAMBDA_FUNCTION_TIMEOUT_IN_MILLISECONDS
  },
});

export default sequelize;
