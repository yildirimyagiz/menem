import 'package:flutter/material.dart';
import '../../services/navigation_service.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
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
              'Privacy Policy',
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
              'Information We Collect',
              'We collect information that you provide directly to us, including but not limited to:\n\n'
                  '• Personal information (name, email address, phone number)\n'
                  '• Profile information\n'
                  '• Communication preferences\n'
                  '• Device information\n'
                  '• Usage data',
            ),
            _buildSection(
              context,
              'How We Use Your Information',
              'We use the information we collect to:\n\n'
                  '• Provide and maintain our services\n'
                  '• Improve and personalize your experience\n'
                  '• Communicate with you about updates and changes\n'
                  '• Ensure the security of our services\n'
                  '• Comply with legal obligations',
            ),
            _buildSection(
              context,
              'Information Sharing',
              'We do not sell your personal information. We may share your information with:\n\n'
                  '• Service providers who assist in our operations\n'
                  '• Legal authorities when required by law\n'
                  '• Business partners with your consent',
            ),
            _buildSection(
              context,
              'Your Rights',
              'You have the right to:\n\n'
                  '• Access your personal information\n'
                  '• Correct inaccurate information\n'
                  '• Request deletion of your information\n'
                  '• Opt-out of marketing communications\n'
                  '• Data portability',
            ),
            _buildSection(
              context,
              'Contact Us',
              'If you have any questions about this Privacy Policy, please contact us at:\n\n'
                  'Email: privacy@example.com\n'
                  'Phone: +1 (555) 123-4567\n'
                  'Address: 123 Privacy Street, Security City, 12345',
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
