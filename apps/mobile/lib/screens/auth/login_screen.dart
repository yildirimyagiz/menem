import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:mobile/utils/auth_service.dart';
import '../../services/navigation_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;
  String? _error;

  Future<String?> _onLogin(LoginData data) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await AuthService.signInWithEmailAndPassword(data.name, data.password);
      NavigationService.navigateToReplacement('/dashboard');
      return null;
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
      return e.toString();
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<String?> _onSignup(SignupData data) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await AuthService.signUpWithEmailAndPassword(
        data.name!,
        data.password!,
        data.additionalSignupData!['name'] as String,
      );
      return null;
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
      return e.toString();
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<String?> _onRecoverPassword(String email) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await AuthService.resetPassword(email);
      return null;
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
      return e.toString();
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<String?> _onGoogleLogin() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await AuthService.signInWithGoogle();
      return null;
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
      return e.toString();
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        FlutterLogin(
          onLogin: _onLogin,
          onSignup: _onSignup,
          onRecoverPassword: _onRecoverPassword,
          onSubmitAnimationCompleted: () {
            NavigationService.navigateToReplacement('/home');
          },
          theme: LoginTheme(
            primaryColor: Theme.of(context).primaryColor,
            accentColor: Theme.of(context).colorScheme.secondary,
            errorColor: Colors.red,
            pageColorLight: Theme.of(context).colorScheme.surface,
            pageColorDark: Theme.of(context).colorScheme.surface,
            logoWidth: 0.80,
            titleStyle: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            bodyStyle: const TextStyle(
              fontSize: 16,
            ),
            buttonStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
            cardTheme: CardTheme(
              color: Theme.of(context).colorScheme.surface,
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            inputTheme: InputDecorationTheme(
              filled: true,
              fillColor: Theme.of(context).colorScheme.surface,
              contentPadding: const EdgeInsets.symmetric(vertical: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
          messages: LoginMessages(
            userHint: 'Email',
            passwordHint: 'Password',
            confirmPasswordHint: 'Confirm Password',
            loginButton: 'LOGIN',
            signupButton: 'SIGN UP',
            forgotPasswordButton: 'Forgot Password?',
            recoverPasswordButton: 'RECOVER',
            goBackButton: 'GO BACK',
            confirmPasswordError: 'Passwords do not match',
            recoverPasswordDescription:
                'Enter your email to recover your password',
            recoverPasswordSuccess: 'Recovery email sent',
            flushbarTitleError: 'Error',
            flushbarTitleSuccess: 'Success',
            providersTitleFirst: 'Or login with',
          ),
          userValidator: (value) {
            if (value == null || value.isEmpty) {
              return 'Email is required';
            }
            if (!value.contains('@')) {
              return 'Invalid email format';
            }
            return null;
          },
          passwordValidator: (value) {
            if (value == null || value.isEmpty) {
              return 'Password is required';
            }
            if (value.length < 6) {
              return 'Password must be at least 6 characters';
            }
            return null;
          },
          loginProviders: [
            LoginProvider(
              icon: Icons.g_mobiledata,
              label: 'Google',
              callback: _onGoogleLogin,
            ),
          ],
          additionalSignupFields: const [
            UserFormField(
              keyName: 'name',
              displayName: 'Name',
              fieldValidator: null,
            ),
          ],
        ),
        if (_isLoading)
          Container(
            color: Colors.black.withAlpha((0.5 * 255).toInt()),
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          ),
        if (_error != null)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Material(
              color: Colors.red,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  _error!,
                  style: const TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
