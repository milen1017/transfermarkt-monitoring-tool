const bcrypt = require('bcrypt');
require('dotenv').config();

const testBcrypt = async () => {
  try {
    const plainPassword = 'ivan'; // Replace with the password you want to test
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password Match:', isMatch); // Should print: true

    // Test with an incorrect password
    const incorrectPassword = 'wrongpassword';
    const isIncorrectMatch = await bcrypt.compare(incorrectPassword, hashedPassword);
    console.log('Incorrect Password Match:', isIncorrectMatch); // Should print: false
  } catch (error) {
    console.error('Error during bcrypt testing:', error);
  }
};

testBcrypt();