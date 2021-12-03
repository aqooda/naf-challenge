export type HighlightType = typeof highlightTypes[number];

export type HighlightStatus = typeof highlightStatuses[number];

export const highlightTypes = ['TEXT', 'AREA'] as const;

export const highlightStatuses = ['APPROVED', 'REJECTED'] as const;
