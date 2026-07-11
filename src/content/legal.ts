/**
 * Centralized legal, safety, and attribution copy.
 *
 * Keeping this text in one module means the same wording appears in onboarding,
 * the About tab, and the standalone legal screens, and makes review before an
 * app-store submission straightforward.
 *
 * NOTE: This copy is written to be honest and conservative for a public,
 * information-only app. It is not legal advice. Before publishing, have the
 * operator's contact details filled in and, ideally, reviewed by counsel.
 */

export const APP_NAME = 'ClearDrive';
export const OPERATOR_NAME = 'the ClearDrive team';
export const CONTACT_EMAIL = 'support@cleardrive.app';
export const LAST_UPDATED = 'July 1, 2026';

/** One-line disclaimer shown on data surfaces throughout the app. */
export const SHORT_DISCLAIMER =
  'For general information only — not a safety determination. Always follow official advisories.';

/** The primary safety disclaimer shown in the onboarding gate. */
export const SAFETY_DISCLAIMER_TITLE = 'Before you start';

export const SAFETY_DISCLAIMER_POINTS: string[] = [
  'ClearDrive shows water-quality information for educational and awareness purposes only. It is not a substitute for official government advisories, beach closures, or drinking-water notices.',
  'Do not use ClearDrive to decide whether water is safe to drink, swim in, fish from, or use in any other way. Water conditions can change rapidly and a single reading cannot capture that.',
  'Official readings come from public sources such as the USGS and are provided "as is." They may be delayed, incomplete, or superseded. Some values shown are illustrative sample data, clearly labeled as such.',
  'Community samples are submitted by members of the public. They are unverified, may be inaccurate, and are not endorsed by ClearDrive or any agency.',
  'In an emergency, or if you suspect a spill, illegal discharge, or a health hazard, contact the NJDEP hotline at 1-877-WARNDEP (1-877-927-6337) or call 911.',
];

/** Short disclaimer specific to community-submitted data. */
export const COMMUNITY_DISCLAIMER =
  'Community samples are crowdsourced and unverified. They may be inaccurate or incomplete and are not reviewed or endorsed by ClearDrive or any government agency.';

/** Short disclaimer specific to reference ranges / status badges. */
export const STATUS_DISCLAIMER =
  'Status labels compare readings to simplified, general reference ranges — not regulatory standards. They are indicators only.';

export interface LegalSection {
  heading: string;
  body: string[];
}

export const DISCLAIMER_SECTIONS: LegalSection[] = [
  {
    heading: 'Information only',
    body: [
      `${APP_NAME} provides water-quality information about bodies of water in New Jersey for general educational and awareness purposes. It is not intended to provide health, safety, medical, or regulatory advice.`,
      'Nothing in this app is a determination that water is safe or unsafe for drinking, swimming, fishing, recreation, agriculture, or any other purpose.',
    ],
  },
  {
    heading: 'Not a substitute for official guidance',
    body: [
      'Always rely on official sources for decisions. Beach and recreational-water advisories in New Jersey are issued by the New Jersey Department of Environmental Protection (NJDEP) and local health departments. Drinking-water safety is governed by your public water utility and the NJDEP.',
      'If an official advisory conflicts with anything shown in this app, follow the official advisory.',
    ],
  },
  {
    heading: 'Reference ranges are simplified',
    body: [
      'The "Good / Moderate / Poor / Unhealthy" status labels compare individual readings against simplified, general reference ranges drawn from public guidance. They are not the legal water-quality standards used by regulators and do not account for site-specific conditions, mixing, timing, or combinations of pollutants.',
    ],
  },
  {
    heading: 'Data accuracy and availability',
    body: [
      'Official data is retrieved from third-party public services (such as the USGS) and is provided on an "as is" and "as available" basis. It may be delayed, interrupted, incomplete, or contain errors outside our control. Some readings are illustrative sample data included for demonstration and offline use, and are labeled accordingly.',
      'Community samples are unverified and may be inaccurate. We do not independently confirm them.',
    ],
  },
  {
    heading: 'No liability',
    body: [
      `To the maximum extent permitted by law, ${OPERATOR_NAME} is not liable for any loss, injury, or damage arising from reliance on information in ${APP_NAME}. You use the app and its information at your own risk.`,
    ],
  },
  {
    heading: 'Emergencies',
    body: [
      'This app is not monitored and cannot respond to emergencies. To report a spill, discharge, or environmental hazard in New Jersey, call the NJDEP hotline at 1-877-WARNDEP (1-877-927-6337). In a life-threatening emergency, call 911.',
    ],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    body: [
      `${APP_NAME} is designed to collect as little personal information as possible. This policy explains what the app accesses and how it is handled. Last updated ${LAST_UPDATED}.`,
    ],
  },
  {
    heading: 'Data stored on your device',
    body: [
      'Community samples you submit, your acceptance of the disclaimer, and app preferences are stored locally on your device. This information stays on your device unless a future version offers an explicit opt-in to share it.',
      'You can remove community samples you created from within the app. Uninstalling the app clears this local data.',
    ],
  },
  {
    heading: 'Location',
    body: [
      'If you grant location permission, your approximate location is used only on your device to sort nearby water bodies and to optionally prefill coordinates when you submit a sample. Your location is not sent to us or to third parties, and location permission is entirely optional — the app works without it.',
    ],
  },
  {
    heading: 'Network requests',
    body: [
      'When online, the app requests public water-quality data from third-party services such as the USGS. These requests are needed to display current readings and are subject to those services’ own policies. We do not attach personal identifiers to these requests.',
    ],
  },
  {
    heading: 'Analytics and tracking',
    body: [
      'This version of the app does not include third-party advertising or cross-app tracking. If analytics are added in the future, this policy will be updated and, where required, consent will be requested.',
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      'The app is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children.',
    ],
  },
  {
    heading: 'Contact',
    body: [`Questions about privacy can be sent to ${CONTACT_EMAIL}.`],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance',
    body: [
      `By using ${APP_NAME}, you agree to these terms and to the disclaimer shown when you first open the app. If you do not agree, please do not use the app.`,
    ],
  },
  {
    heading: 'Permitted use',
    body: [
      'You may use the app for personal, non-commercial, informational purposes. You agree not to misuse the app, interfere with its operation, or use it in any unlawful way.',
    ],
  },
  {
    heading: 'Community submissions',
    body: [
      'If you submit a community sample, you confirm the information is provided in good faith and that you have the right to share it. Do not submit false, misleading, offensive, or personal information about others.',
      `${OPERATOR_NAME} may remove or decline to display any submission and is not obligated to store or display community content.`,
    ],
  },
  {
    heading: 'No warranty',
    body: [
      'The app and all information in it are provided "as is" and "as available" without warranties of any kind, express or implied, including accuracy, fitness for a particular purpose, or non-infringement.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      `To the fullest extent permitted by law, ${OPERATOR_NAME} will not be liable for any indirect, incidental, or consequential damages, or any decision made in reliance on the app.`,
    ],
  },
  {
    heading: 'Changes',
    body: [
      'We may update these terms and the app from time to time. Continued use after changes take effect constitutes acceptance of the updated terms.',
    ],
  },
];

export interface DataSource {
  name: string;
  description: string;
  url: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    name: 'USGS National Water Information System (NWIS)',
    description:
      'Live and historical streamflow and water-quality readings from U.S. Geological Survey monitoring stations. Public domain.',
    url: 'https://waterdata.usgs.gov/nwis',
  },
  {
    name: 'Water Quality Portal',
    description:
      'A cooperative service of USGS, EPA, and the National Water Quality Monitoring Council aggregating water-quality monitoring data.',
    url: 'https://www.waterqualitydata.us',
  },
  {
    name: 'NJDEP Division of Water Monitoring & Standards',
    description:
      'New Jersey Department of Environmental Protection monitoring programs, surface-water quality standards, and recreational-water advisories.',
    url: 'https://dep.nj.gov/wms/',
  },
  {
    name: 'US EPA Recreational & Drinking Water Criteria',
    description:
      'Federal water-quality criteria and guidance used to inform the simplified reference ranges in this app.',
    url: 'https://www.epa.gov/wqc',
  },
];

export const COMMUNITY_GUIDELINES: string[] = [
  'Only submit measurements you actually took or directly observed.',
  'Use calibrated equipment where possible and record what you can.',
  'Do not include personal information about yourself or others.',
  'Community data is public-spirited but unverified — never present it as official.',
];
