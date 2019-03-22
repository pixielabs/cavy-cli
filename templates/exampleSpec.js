const content = `export default function(spec) {

  spec.describe('Logging in', function() {

    spec.it('filters the list by search input', async function() {
      await spec.exists('LoginScreen');
      await spec.fillIn('LoginScreen.EmailInput', 'cavy@example.com');
      await spec.fillIn('LoginScreen.PasswordInput', 'password');
      await spec.exists('WelcomeScreen');
    });
  });
}`;

module.exports = content;
