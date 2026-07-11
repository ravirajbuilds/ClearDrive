import type { Measurement, ParameterId, WaterBody } from './models';

/**
 * Bundled New Jersey water-body dataset.
 *
 * The measurement VALUES below are illustrative sample data used for offline
 * display and as a fallback when live data is unavailable. They are labeled
 * "Sample data" in the UI. When the device is online, `officialApi` replaces
 * these with real, attributed readings from the USGS National Water Information
 * System where a station is available. The station IDs are real USGS NJ sites so
 * live fetches resolve; coordinates are approximate.
 *
 * Nothing here is a regulatory determination. See the in-app disclaimers.
 */

const SNAPSHOT = '2026-06-15T12:00:00.000Z';

function m(parameter: ParameterId, value: number, collectedAt = SNAPSHOT): Measurement {
  return { parameter, value, collectedAt };
}

export const WATER_BODIES: WaterBody[] = [
  {
    id: 'delaware-river-trenton',
    name: 'Delaware River at Trenton',
    type: 'river',
    county: 'Mercer',
    municipality: 'Trenton',
    latitude: 40.2224,
    longitude: -74.7785,
    description:
      "New Jersey's western boundary river and a major drinking-water source for the region. Monitored continuously near Trenton.",
    station: {
      id: '01463500',
      name: 'Delaware River at Trenton NJ',
      agency: 'USGS',
      latitude: 40.2224,
      longitude: -74.7785,
    },
    officialSource: 'USGS National Water Information System (site 01463500)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.6),
      m('dissolvedOxygen', 8.2),
      m('turbidity', 6),
      m('temperature', 23.5),
      m('conductivity', 320),
      m('nitrate', 1.4),
    ],
  },
  {
    id: 'raritan-river-manville',
    name: 'Raritan River near Manville',
    type: 'river',
    county: 'Somerset',
    municipality: 'Manville',
    latitude: 40.5518,
    longitude: -74.589,
    description:
      "The Raritan drains much of central New Jersey and feeds reservoirs that supply drinking water. It receives urban and agricultural runoff.",
    station: {
      id: '01400500',
      name: 'Raritan River at Manville NJ',
      agency: 'USGS',
      latitude: 40.5518,
      longitude: -74.589,
    },
    officialSource: 'USGS National Water Information System (site 01400500)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.3),
      m('dissolvedOxygen', 6.9),
      m('turbidity', 14),
      m('temperature', 24.1),
      m('conductivity', 610),
      m('nitrate', 3.8),
      m('ecoli', 190),
    ],
  },
  {
    id: 'passaic-river-little-falls',
    name: 'Passaic River at Little Falls',
    type: 'river',
    county: 'Passaic',
    municipality: 'Little Falls',
    latitude: 40.8859,
    longitude: -74.2229,
    description:
      'A heavily urbanized river in northern New Jersey with a long industrial history. Water quality varies sharply with rainfall.',
    station: {
      id: '01389500',
      name: 'Passaic River at Little Falls NJ',
      agency: 'USGS',
      latitude: 40.8859,
      longitude: -74.2229,
    },
    officialSource: 'USGS National Water Information System (site 01389500)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.1),
      m('dissolvedOxygen', 5.4),
      m('turbidity', 28),
      m('temperature', 25.0),
      m('conductivity', 940),
      m('nitrate', 4.6),
      m('ecoli', 320),
    ],
  },
  {
    id: 'hackensack-river-new-milford',
    name: 'Hackensack River at New Milford',
    type: 'river',
    county: 'Bergen',
    municipality: 'New Milford',
    latitude: 40.9432,
    longitude: -74.0201,
    description:
      'A tidal river in densely populated Bergen County that transitions to brackish water downstream toward Newark Bay.',
    station: {
      id: '01378500',
      name: 'Hackensack River at New Milford NJ',
      agency: 'USGS',
      latitude: 40.9432,
      longitude: -74.0201,
    },
    officialSource: 'USGS National Water Information System (site 01378500)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.4),
      m('dissolvedOxygen', 6.1),
      m('turbidity', 18),
      m('temperature', 24.8),
      m('conductivity', 1200),
    ],
  },
  {
    id: 'millstone-river-blackwells-mills',
    name: 'Millstone River at Blackwells Mills',
    type: 'river',
    county: 'Somerset',
    municipality: 'Millstone',
    latitude: 40.4776,
    longitude: -74.6099,
    description:
      'A tributary of the Raritan flowing through central New Jersey farmland and suburbs, paralleling the D&R Canal.',
    station: {
      id: '01402000',
      name: 'Millstone River at Blackwells Mills NJ',
      agency: 'USGS',
      latitude: 40.4776,
      longitude: -74.6099,
    },
    officialSource: 'USGS National Water Information System (site 01402000)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.5),
      m('dissolvedOxygen', 7.6),
      m('turbidity', 9),
      m('temperature', 23.0),
      m('conductivity', 480),
      m('nitrate', 2.6),
      m('phosphorus', 0.08),
    ],
  },
  {
    id: 'toms-river',
    name: 'Toms River near Toms River',
    type: 'river',
    county: 'Ocean',
    municipality: 'Toms River',
    latitude: 39.9776,
    longitude: -74.2129,
    description:
      'A Pinelands-influenced river that flows into Barnegat Bay. Naturally tea-colored from cedar swamps and typically low in nutrients.',
    station: {
      id: '01408500',
      name: 'Toms River near Toms River NJ',
      agency: 'USGS',
      latitude: 39.9776,
      longitude: -74.2129,
    },
    officialSource: 'USGS National Water Information System (site 01408500)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 6.4),
      m('dissolvedOxygen', 7.9),
      m('turbidity', 4),
      m('temperature', 22.2),
      m('conductivity', 180),
      m('nitrate', 0.6),
    ],
  },
  {
    id: 'great-egg-harbor-river-folsom',
    name: 'Great Egg Harbor River at Folsom',
    type: 'river',
    county: 'Atlantic',
    municipality: 'Folsom',
    latitude: 39.6015,
    longitude: -74.8496,
    description:
      'A federally designated Wild and Scenic river running through the Pine Barrens toward the Atlantic coast.',
    station: {
      id: '01411000',
      name: 'Great Egg Harbor River at Folsom NJ',
      agency: 'USGS',
      latitude: 39.6015,
      longitude: -74.8496,
    },
    officialSource: 'USGS National Water Information System (site 01411000)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 5.9),
      m('dissolvedOxygen', 7.2),
      m('turbidity', 5),
      m('temperature', 21.8),
      m('conductivity', 95),
    ],
  },
  {
    id: 'wallkill-river-franklin',
    name: 'Wallkill River near Franklin',
    type: 'river',
    county: 'Sussex',
    municipality: 'Franklin',
    latitude: 41.1204,
    longitude: -74.5846,
    description:
      'One of the few New Jersey rivers that flows north, draining agricultural valleys in Sussex County toward New York.',
    station: {
      id: '01367770',
      name: 'Wallkill River near Franklin NJ',
      agency: 'USGS',
      latitude: 41.1204,
      longitude: -74.5846,
    },
    officialSource: 'USGS National Water Information System (site 01367770)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.8),
      m('dissolvedOxygen', 6.4),
      m('turbidity', 22),
      m('temperature', 23.4),
      m('conductivity', 560),
      m('nitrate', 5.2),
      m('phosphorus', 0.14),
    ],
  },
  {
    id: 'lake-hopatcong',
    name: 'Lake Hopatcong',
    type: 'lake',
    county: 'Morris',
    municipality: 'Hopatcong',
    latitude: 40.9612,
    longitude: -74.6193,
    description:
      "New Jersey's largest freshwater lake and a popular recreation destination. Prone to harmful algal blooms in warm months.",
    officialSource: 'Illustrative sample data (no continuous USGS station)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 8.3),
      m('dissolvedOxygen', 6.0),
      m('turbidity', 16),
      m('temperature', 26.5),
      m('phosphorus', 0.11),
      m('nitrate', 1.1),
    ],
  },
  {
    id: 'round-valley-reservoir',
    name: 'Round Valley Reservoir',
    type: 'reservoir',
    county: 'Hunterdon',
    municipality: 'Lebanon',
    latitude: 40.6151,
    longitude: -74.8382,
    description:
      'A deep, exceptionally clear drinking-water reservoir and state recreation area known for its clarity and cold water.',
    officialSource: 'Illustrative sample data (no continuous USGS station)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.7),
      m('dissolvedOxygen', 9.1),
      m('turbidity', 2),
      m('temperature', 19.0),
      m('phosphorus', 0.02),
      m('nitrate', 0.4),
    ],
  },
  {
    id: 'wanaque-reservoir',
    name: 'Wanaque Reservoir',
    type: 'reservoir',
    county: 'Passaic',
    municipality: 'Wanaque',
    latitude: 41.0568,
    longitude: -74.2932,
    description:
      'A major drinking-water reservoir for northern New Jersey, fed by the Wanaque and Ramapo rivers.',
    officialSource: 'Illustrative sample data (no continuous USGS station)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.4),
      m('dissolvedOxygen', 8.4),
      m('turbidity', 5),
      m('temperature', 21.0),
      m('phosphorus', 0.04),
      m('nitrate', 0.9),
    ],
  },
  {
    id: 'barnegat-bay-seaside',
    name: 'Barnegat Bay at Seaside Heights',
    type: 'bay',
    county: 'Ocean',
    municipality: 'Seaside Heights',
    latitude: 39.9448,
    longitude: -74.0771,
    description:
      'A shallow coastal lagoon central to the Jersey Shore economy, sensitive to nutrient pollution and warming water.',
    officialSource: 'Illustrative sample data (estuarine monitoring)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 8.0),
      m('dissolvedOxygen', 6.6),
      m('turbidity', 12),
      m('temperature', 25.7),
      m('enterococci', 28),
    ],
  },
  {
    id: 'belmar-beach',
    name: 'Belmar Beach (Atlantic Ocean)',
    type: 'beach',
    county: 'Monmouth',
    municipality: 'Belmar',
    latitude: 40.1782,
    longitude: -74.0121,
    description:
      'A popular ocean bathing beach. Marine bathing water is monitored for enterococci bacteria under the state Cooperative Coastal Monitoring Program.',
    officialSource: 'Illustrative sample data (coastal bathing-water monitoring)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('enterococci', 10),
      m('ph', 8.1),
      m('temperature', 22.0),
    ],
  },
  {
    id: 'navesink-river-red-bank',
    name: 'Navesink River at Red Bank',
    type: 'estuary',
    county: 'Monmouth',
    municipality: 'Red Bank',
    latitude: 40.3499,
    longitude: -74.0651,
    description:
      'A tidal estuary feeding Sandy Hook Bay, historically important for shellfishing and sensitive to bacterial pollution after storms.',
    officialSource: 'Illustrative sample data (estuarine monitoring)',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.9),
      m('dissolvedOxygen', 6.8),
      m('turbidity', 15),
      m('temperature', 24.0),
      m('enterococci', 62),
    ],
  },
  {
    id: 'cooper-river-camden',
    name: 'Cooper River at Camden',
    type: 'river',
    county: 'Camden',
    municipality: 'Camden',
    latitude: 39.9346,
    longitude: -75.0876,
    description:
      'An urban river and rowing venue in South Jersey that drains developed watersheds before reaching the Delaware.',
    officialSource: 'Illustrative sample data',
    officialSnapshotAt: SNAPSHOT,
    officialMeasurements: [
      m('ph', 7.2),
      m('dissolvedOxygen', 5.1),
      m('turbidity', 33),
      m('temperature', 25.9),
      m('conductivity', 880),
      m('ecoli', 450),
    ],
  },
];

export function getWaterBody(id: string): WaterBody | undefined {
  return WATER_BODIES.find((w) => w.id === id);
}
