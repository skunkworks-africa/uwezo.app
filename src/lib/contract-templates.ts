
export const engagementTypes = [
  "Intern",
  "Partnership",
  "Contractual",
  "Sub-contractual",
  "Permanent",
  "Instructor",
  "Student",
  "Partner",
  "Course Developer",
  "Sponsor",
  "Customer",
  "Reseller",
] as const;

export type EngagementType = typeof engagementTypes[number];

const genericTemplate = `
GENERIC AGREEMENT

This agreement is entered on {DATE} by and between:
Uwezo Inc., and you, the user (the “Recipient”).

This is a generic template for {TYPE}. Please replace this with the actual content for the selected engagement type.

1. Scope of Work
The Recipient agrees to perform services as outlined by the Company.

2. Confidentiality
The Recipient shall maintain all information in confidence.

3. Term and Termination
This agreement shall commence on {DATE} and continue until terminated by either party.
`;

export const contractTemplates: Record<EngagementType, string> = {
  Intern: genericTemplate.replace('{TYPE}', 'Intern'),
  Partnership: genericTemplate.replace('{TYPE}', 'Partnership'),
  Contractual: genericTemplate.replace('{TYPE}', 'Contractual'),
  "Sub-contractual": genericTemplate.replace('{TYPE}', 'Sub-contractual'),
  Permanent: `
PERMANENT EMPLOYMENT AGREEMENT

This agreement is entered on {DATE} by and between:
Uwezo Inc., ("Company") and you ("Employee").

The Company agrees to employ the Employee on a permanent basis under the following terms:

1. Position and Duties
The Employee's initial title will be determined upon role assignment.

2. Compensation
Compensation details will be provided in a separate offer letter.

3. Confidentiality & Non-Compete
The Employee agrees to a standard confidentiality and non-compete clause.
  `,
  Instructor: genericTemplate.replace('{TYPE}', 'Instructor'),
  Student: genericTemplate.replace('{TYPE}', 'Student'),
  Partner: genericTemplate.replace('{TYPE}', 'Partner'),
  "Course Developer": genericTemplate.replace('{TYPE}', 'Course Developer'),
  Sponsor: genericTemplate.replace('{TYPE}', 'Sponsor'),
  Customer: genericTemplate.replace('{TYPE}', 'Customer'),
  Reseller: genericTemplate.replace('{TYPE}', 'Reseller'),
};
