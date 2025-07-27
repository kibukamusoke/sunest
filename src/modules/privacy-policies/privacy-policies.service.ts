import { Injectable } from '@nestjs/common';

export interface PrivacyPolicy {
    id: string;
    appName: string;
    appId: string;
    version: string;
    lastUpdated: string;
    content: string;
    language: string;
}

@Injectable()
export class PrivacyPoliciesService {
    private readonly privacyPolicies: Map<string, PrivacyPolicy> = new Map();

    constructor() {
        this.initializePolicies();
    }

    private initializePolicies() {
        // Docker Monitor Privacy Policy
        const dockerMonitorPolicy: PrivacyPolicy = {
            id: 'docker-monitor',
            appName: 'Docker Monitor',
            appId: '88101862-20ac-40cf-a3b0-2e21dfe1032c',
            version: '1.0.0',
            lastUpdated: '2025-07-27',
            language: 'en',
            content: `<h1>Privacy Policy for Docker Monitor</h1>

<p><strong>Effective Date: July 27, 2025</strong></p>

<h2>1. Introduction</h2>

<p>Docker Monitor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Docker Monitor mobile application.</p>

<h2>2. Information We Do NOT Collect</h2>

<p><strong>Docker Monitor is designed with privacy as a core principle. We do NOT collect, store, or transmit:</strong></p>

<ul>
<li>Personal information (names, email addresses, phone numbers)</li>
<li>Docker server configurations or credentials</li>
<li>Container data, logs, or application content</li>
<li>SSH keys or authentication credentials</li>
<li>Server IP addresses or connection details</li>
<li>Usage analytics or behavioral data</li>
<li>Device identifiers or tracking information</li>
</ul>

<h2>3. Local Data Storage</h2>

<p><strong>All data is stored locally on your device:</strong></p>

<ul>
<li>Docker server configurations are stored locally in your device's secure storage</li>
<li>SSH profiles and credentials are encrypted and stored locally</li>
<li>Container information is cached locally and not transmitted</li>
<li>App settings and preferences remain on your device</li>
<li>No data is synchronized to external servers</li>
</ul>

<h2>4. Network Communications</h2>

<p><strong>Limited network activity for essential functionality:</strong></p>

<ul>
<li><strong>Docker API Communications</strong>: Direct connections to your Docker servers for container management</li>
<li><strong>SSH Tunneling</strong>: Secure encrypted connections to your remote servers</li>
<li><strong>App Updates</strong>: Standard app store update mechanisms only</li>
<li><strong>No Analytics</strong>: We do not send usage statistics or analytics data</li>
</ul>

<h2>5. Third-Party Services</h2>

<p><strong>We use minimal third-party services:</strong></p>

<ul>
<li><strong>App Stores</strong>: Standard app distribution through Apple App Store and Google Play Store</li>
<li><strong>Payment Processing</strong>: Stripe for premium feature purchases (if applicable)</li>
<li><strong>No Advertising</strong>: We do not integrate advertising networks</li>
<li><strong>No Analytics</strong>: We do not use analytics or tracking services</li>
</ul>

<h2>6. Data Security</h2>

<p><strong>We implement security measures to protect your data:</strong></p>

<ul>
<li>All local data is encrypted using device security features</li>
<li>SSH connections use industry-standard encryption</li>
<li>No sensitive data is transmitted to our servers</li>
<li>App permissions are minimal and necessary for functionality</li>
</ul>

<h2>7. Your Rights</h2>

<p><strong>You have complete control over your data:</strong></p>

<ul>
<li><strong>Access</strong>: All your data is stored locally and accessible through the app</li>
<li><strong>Deletion</strong>: You can delete all app data through device settings</li>
<li><strong>Export</strong>: Backup and export functionality is available within the app</li>
<li><strong>Control</strong>: You control all Docker server connections and SSH configurations</li>
</ul>

<h2>8. Children's Privacy</h2>

<p>Docker Monitor is not intended for use by children under 13. We do not knowingly collect personal information from children under 13.</p>

<h2>9. Changes to This Policy</h2>

<p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
<ul>
<li>Posting the new Privacy Policy in the app</li>
<li>Updating the "Effective Date" at the top of this policy</li>
</ul>

<h2>10. Legal Basis</h2>

<p>This Privacy Policy is provided in compliance with:</p>
<ul>
<li>General Data Protection Regulation (GDPR)</li>
<li>California Consumer Privacy Act (CCPA)</li>
<li>Other applicable privacy laws and regulations</li>
</ul>

<h2>11. Data Processing</h2>

<p><strong>Data Processing Activities:</strong></p>
<ul>
<li><strong>Purpose</strong>: Docker container management and monitoring</li>
<li><strong>Legal Basis</strong>: Legitimate interest in providing Docker management services</li>
<li><strong>Retention</strong>: Data is stored locally and retained as long as the app is installed</li>
<li><strong>Sharing</strong>: No data is shared with third parties</li>
</ul>

<h2>12. International Transfers</h2>

<p>Since all data is stored locally on your device, no international data transfers occur through our application.</p>

<h2>13. Data Breach Procedures</h2>

<p>In the unlikely event of a data breach affecting our systems:</p>
<ol>
<li>We will assess the scope and impact</li>
<li>Notify affected users within 72 hours</li>
<li>Take immediate steps to secure systems</li>
<li>Provide guidance on protective measures</li>
</ol>

<h2>14. Consent</h2>

<p>By using Docker Monitor, you consent to this Privacy Policy. If you do not agree with this policy, please do not use the application.</p>

<hr>

<p><strong>Last Updated</strong>: July 27, 2025<br>
<strong>Version</strong>: 1.0.0</p>`,
        };

        this.privacyPolicies.set('docker-monitor', dockerMonitorPolicy);
    }

    /**
     * Get all available privacy policies
     */
    getAllPolicies(): PrivacyPolicy[] {
        return Array.from(this.privacyPolicies.values());
    }

    /**
     * Get a specific privacy policy by ID
     */
    getPolicyById(id: string): PrivacyPolicy | null {
        return this.privacyPolicies.get(id) || null;
    }

    /**
     * Get privacy policy by app ID
     */
    getPolicyByAppId(appId: string): PrivacyPolicy | null {
        return Array.from(this.privacyPolicies.values()).find(
            policy => policy.appId === appId
        ) || null;
    }

    /**
     * Get privacy policy by app name
     */
    getPolicyByAppName(appName: string): PrivacyPolicy | null {
        return Array.from(this.privacyPolicies.values()).find(
            policy => policy.appName.toLowerCase() === appName.toLowerCase()
        ) || null;
    }

    /**
     * Add a new privacy policy
     */
    addPolicy(policy: PrivacyPolicy): void {
        this.privacyPolicies.set(policy.id, policy);
    }

    /**
     * Update an existing privacy policy
     */
    updatePolicy(id: string, policy: Partial<PrivacyPolicy>): boolean {
        const existingPolicy = this.privacyPolicies.get(id);
        if (!existingPolicy) {
            return false;
        }

        const updatedPolicy = { ...existingPolicy, ...policy };
        this.privacyPolicies.set(id, updatedPolicy);
        return true;
    }

    /**
     * Delete a privacy policy
     */
    deletePolicy(id: string): boolean {
        return this.privacyPolicies.delete(id);
    }

    /**
     * Get available policy IDs
     */
    getPolicyIds(): string[] {
        return Array.from(this.privacyPolicies.keys());
    }
} 