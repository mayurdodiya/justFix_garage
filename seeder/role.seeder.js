const Role = require('../models/role.model');
const { roles } = require('./seedData');

/**
 * Role seeder.
 */
module.exports = roleSeeder = async () => { 
    try {
        for (let role of roles) {
            const alreadyExist = await Role.findOne({ role: role.role }); // Get role by role name.

            if (!alreadyExist) await Role.create({ role: role.role }); // If role doesn't exists, create role.
        }

        console.log('✅ Role seeder run successfully...');
    } catch (error) {
        console.log('❌ Error from role seeder :', error);
    }
};
