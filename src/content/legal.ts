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
export const LAST_UPDATED = 'July 11, 2026';

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
  'Home water tests you log use screening tools (strips, meters, kits) that are not lab-grade. They cannot tell you whether your tap water is safe — lead and PFAS require a certified laboratory.',
  'In an emergency, or if you suspect a spill, illegal discharge, or a health hazard, contact the NJDEP hotline at 1-877-WARNDEP (1-877-927-6337) or call 911.',
];

/** Short disclaimer specific to community-submitted data. */
export const COMMUNITY_DISCLAIMER =
  'Community samples are crowdsourced and unverified. They may be inaccurate or incomplete and are not reviewed or endorsed by ClearDrive or any government agency.';

/** Short disclaimer shown on the home tap-water testing surfaces. */
export const HOME_WATER_DISCLAIMER =
  'Home test strips and kits are screening tools, not lab tests. This does not tell you whether your tap water is safe. Lead and PFAS need a certified lab. Contact your water utility and NJDEP.';

/** Longer points shown on the home tap-water intro and legal section. */
export const HOME_WATER_POINTS: string[] = [
  'Home test strips, TDS meters, and mail-in kits are screening tools. Their accuracy varies and they are not a substitute for analysis by a certified laboratory.',
  'This feature cannot tell you whether your tap water is safe to drink. It records your own readings for your reference only.',
  'Lead and PFAS in particular require accredited laboratory testing to measure reliably. Do not rely on a home strip for these.',
  'For an official picture of your water, read your utility’s annual Consumer Confidence Report (CCR) and, if you have concerns, arrange testing through a New Jersey certified laboratory.',
  'Questions about drinking water can go to the EPA Safe Drinking Water Hotline at 1-800-426-4791 or your local health department.',
  'Not all filters remove all contaminants. Effectiveness depends on the filter type, its certification (look for NSF/ANSI standards), and whether it is maintained and replaced on schedule.',
];

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
    heading: 'Home tap-water tests',
    body: [
      'The home water testing feature lets you record readings from consumer test strips, meters, or mail-in kits. These are screening tools, not accredited laboratory analyses, and their accuracy varies widely.',
      'Nothing in this feature tells you whether your tap water is safe to drink. Lead and PFAS in particular cannot be measured reliably with home strips and require a certified laboratory. For an official picture, consult your water utility’s Consumer Confidence Report and, if concerned, use a New Jersey certified lab or call the EPA Safe Drinking Water Hotline at 1-800-426-4791.',
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
  {
    name: 'US EPA Ground Water & Drinking Water (incl. PFAS)',
    description:
      'Federal drinking-water regulations, the 2024 PFAS limits, and the Safe Drinking Water Hotline (1-800-426-4791) used for the home tap-water reference ranges.',
    url: 'https://www.epa.gov/ground-water-and-drinking-water',
  },
  {
    name: 'NJDEP Division of Water Supply & Geoscience',
    description:
      'New Jersey drinking-water standards, including the state PFAS maximum contaminant levels, and certified-laboratory information.',
    url: 'https://dep.nj.gov/watersupply/',
  },
];

export const COMMUNITY_GUIDELINES: string[] = [
  'Only submit measurements you actually took or directly observed.',
  'Use calibrated equipment where possible and record what you can.',
  'Do not include personal information about yourself or others.',
  'Community data is public-spirited but unverified — never present it as official.',
];
