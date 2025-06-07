import 'package:flutter/material.dart';
import '../../services/navigation_service.dart';

class TermsOfServiceScreen extends StatelessWidget {
  const TermsOfServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms of Service'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => NavigationService.goBack(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Terms of Service',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Text(
              'Last updated: ${DateTime.now().toString().split(' ')[0]}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              '1. Acceptance of Terms',
              'By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.',
            ),
            _buildSection(
              context,
              '2. Use License',
              'Permission is granted to temporarily download one copy of the application per device for personal, non-commercial transitory viewing only.',
            ),
            _buildSection(
              context,
              '3. User Account',
              'To use certain features of the application, you must register for an account. You agree to provide accurate and complete information and to keep your account credentials secure.',
            ),
            _buildSection(
              context,
              '4. User Conduct',
              'You agree not to:\n\n'
                  '• Use the application for any illegal purpose\n'
                  '• Violate any laws in your jurisdiction\n'
                  '• Infringe upon the rights of others\n'
                  '• Interfere with the proper functioning of the application\n'
                  '• Attempt to gain unauthorized access',
            ),
            _buildSection(
              context,
              '5. Intellectual Property',
              'The application and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.',
            ),
            _buildSection(
              context,
              '6. Termination',
              'We may terminate or suspend your account and bar access to the application immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.',
            ),
            _buildSection(
              context,
              '7. Limitation of Liability',
              'In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
            ),
            _buildSection(
              context,
              '8. Changes to Terms',
              'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days\' notice prior to any new terms taking effect.',
            ),
            _buildSection(
              context,
              '9. Contact Information',
              'If you have any questions about these Terms, please contact us at:\n\n'
                  'Email: terms@example.com\n'
                  'Phone: +1 (555) 123-4567\n'
                  'Address: 123 Terms Street, Legal City, 12345',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}
