function toObject(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function normalizeKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function addCandidate(out: Map<string, string>, key: string, value: unknown) {
  if (value === null || value === undefined) {
    return;
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    return;
  }

  const normalizedKey = normalizeKey(key);
  if (!normalizedKey || out.has(normalizedKey)) {
    return;
  }

  out.set(normalizedKey, stringValue);
}

function collectCandidates(value: unknown, path: string[], out: Map<string, string>) {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectCandidates(item, [...path, String(index)], out);
    });
    return;
  }

  if (typeof value !== 'object') {
    if (path.length === 0) {
      return;
    }

    const leaf = path[path.length - 1];
    addCandidate(out, leaf, value);
    addCandidate(out, path.join('.'), value);
    return;
  }

  const entryObject = value as Record<string, unknown>;
  Object.entries(entryObject).forEach(([key, nested]) => {
    collectCandidates(nested, [...path, key], out);
  });
}

function readAlias(candidates: Map<string, string>, aliases: string[]): string {
  for (const alias of aliases) {
    const match = candidates.get(normalizeKey(alias));
    if (match) {
      return match;
    }
  }

  return '';
}

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function toNormalizedString(value: unknown): string {
  return String(value ?? '').trim();
}

function findFirstMatchingArray(value: unknown, normalizedKeys: Set<string>): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      const nestedMatch = findFirstMatchingArray(item, normalizedKeys);
      if (nestedMatch.length > 0) {
        return nestedMatch;
      }
    }

    return [];
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const source = value as Record<string, unknown>;

  for (const [key, nested] of Object.entries(source)) {
    if (normalizedKeys.has(normalizeKey(key)) && Array.isArray(nested)) {
      const asObjects = nested.filter(
        (item): item is Record<string, unknown> => Boolean(item && typeof item === 'object' && !Array.isArray(item))
      );
      if (asObjects.length > 0) {
        return asObjects;
      }
    }
  }

  for (const nested of Object.values(source)) {
    const nestedMatch = findFirstMatchingArray(nested, normalizedKeys);
    if (nestedMatch.length > 0) {
      return nestedMatch;
    }
  }

  return [];
}

function getHistoryArrayFromSources(
  sources: unknown[],
  keys: string[]
): Record<string, unknown>[] {
  const normalizedKeys = new Set(keys.map((key) => normalizeKey(key)));

  for (const source of sources) {
    const root = toObject(source);
    const nestedData = toObject(root.data);
    const nestedValue = toObject(root.value);
    const nestedResult = toObject(root.result);
    const nestedPayload = toObject(root.payload);

    const candidates: unknown[] = [source, root, nestedData, nestedValue, nestedResult, nestedPayload];
    for (const candidate of candidates) {
      const match = findFirstMatchingArray(candidate, normalizedKeys);
      if (match.length > 0) {
        return match;
      }
    }
  }

  return [];
}

function buildEducationHistoryEntriesPrefill(sources: unknown[]): string {
  const rawEntries = getHistoryArrayFromSources(sources, [
    'educationHistory',
    'educationHistories',
    'educationalHistory',
    'educations'
  ]);

  if (rawEntries.length === 0) {
    return '';
  }

  const normalizedEntries = rawEntries
    .map((entry) => {
      const id = toNormalizedString(
        entry.id ??
          entry.educationHistoryId ??
          entry.educationHistoryID ??
          entry.educationId ??
          entry._id
      );
      const schoolName = toNormalizedString(entry.schoolName ?? entry.school);
      const courseOfStudy = toNormalizedString(entry.courseOfStudy);
      const degree = toNormalizedString(entry.degree);
      const grade = toNormalizedString(entry.grade);
      const educationStartDate = toNormalizedString(entry.educationStartDate ?? entry.startDate);
      const educationEndDate = toNormalizedString(entry.educationEndDate ?? entry.endDate);

      if (
        !hasValue(id) &&
        !hasValue(schoolName) &&
        !hasValue(courseOfStudy) &&
        !hasValue(degree) &&
        !hasValue(grade) &&
        !hasValue(educationStartDate) &&
        !hasValue(educationEndDate)
      ) {
        return null;
      }

      return {
        id,
        schoolName,
        courseOfStudy,
        degree,
        grade,
        educationStartDate,
        educationEndDate
      };
    })
    .filter((entry): entry is {
      id: string;
      schoolName: string;
      courseOfStudy: string;
      degree: string;
      grade: string;
      educationStartDate: string;
      educationEndDate: string;
    } => Boolean(entry));

  return normalizedEntries.length > 0 ? JSON.stringify(normalizedEntries) : '';
}

function buildWorkHistoryEntriesPrefill(sources: unknown[]): string {
  const rawEntries = getHistoryArrayFromSources(sources, [
    'workHistory',
    'workHistories',
    'employmentHistory',
    'employmentHistories'
  ]);

  if (rawEntries.length === 0) {
    return '';
  }

  const normalizedEntries = rawEntries
    .map((entry) => {
      const id = toNormalizedString(
        entry.id ??
          entry.workHistoryId ??
          entry.workHistoryID ??
          entry.workId ??
          entry._id
      );
      const companyName = toNormalizedString(entry.companyName);
      const position = toNormalizedString(entry.position);
      const address = toNormalizedString(entry.address ?? entry.officeAddress);
      const phoneNumber = toNormalizedString(entry.phoneNumber ?? entry.officePhoneNumber);
      const emailAddress = toNormalizedString(entry.emailAddress ?? entry.officeEmail);
      const startDate = toNormalizedString(entry.startDate ?? entry.workStartDate);
      const endDate = toNormalizedString(entry.endDate ?? entry.workEndDate);

      if (
        !hasValue(id) &&
        !hasValue(companyName) &&
        !hasValue(position) &&
        !hasValue(address) &&
        !hasValue(phoneNumber) &&
        !hasValue(emailAddress) &&
        !hasValue(startDate) &&
        !hasValue(endDate)
      ) {
        return null;
      }

      return {
        id,
        companyName,
        position,
        address,
        phoneNumber,
        emailAddress,
        startDate,
        endDate
      };
    })
    .filter((entry): entry is {
      id: string;
      companyName: string;
      position: string;
      address: string;
      phoneNumber: string;
      emailAddress: string;
      startDate: string;
      endDate: string;
    } => Boolean(entry));

  return normalizedEntries.length > 0 ? JSON.stringify(normalizedEntries) : '';
}

function buildContactPrefill(sources: unknown[]): Record<string, string> {
  const rawEntries = getHistoryArrayFromSources(sources, ['contacts', 'contactInformation', 'contactInformations']);

  if (rawEntries.length === 0) {
    return {};
  }

  let residentialAddress = '';
  let residentialId = '';
  let permanentAddress = '';
  let permanentId = '';
  let firstPhoneNumber = '';
  let firstEmail = '';

  rawEntries.forEach((entry) => {
    const addressType = toNormalizedString(entry.addressType).toLowerCase();
    const address = toNormalizedString(entry.address);
    const phoneNumber = toNormalizedString(entry.phoneNumber ?? entry.phone ?? entry.telephoneNumber);
    const email = toNormalizedString(entry.personalEmail ?? entry.emailAddress ?? entry.email);
    const id = toNormalizedString(entry.id ?? entry.contactId ?? entry.contactID ?? entry._id);

    if (!firstPhoneNumber && hasValue(phoneNumber)) {
      firstPhoneNumber = phoneNumber;
    }

    if (!firstEmail && hasValue(email)) {
      firstEmail = email;
    }

    if (addressType === 'residential') {
      if (!residentialAddress && hasValue(address)) {
        residentialAddress = address;
      }
      if (!residentialId && hasValue(id)) {
        residentialId = id;
      }
      return;
    }

    if (addressType === 'permanent') {
      if (!permanentAddress && hasValue(address)) {
        permanentAddress = address;
      }
      if (!permanentId && hasValue(id)) {
        permanentId = id;
      }
    }
  });

  const contactPrefill: Record<string, string> = {};

  if (hasValue(residentialAddress)) {
    contactPrefill.residentialAddress = residentialAddress;
  }

  if (hasValue(permanentAddress)) {
    contactPrefill.permanentAddress = permanentAddress;
  }

  if (hasValue(residentialId)) {
    contactPrefill.contactResidentialId = residentialId;
  }

  if (hasValue(permanentId)) {
    contactPrefill.contactPermanentId = permanentId;
  }

  if (hasValue(firstPhoneNumber)) {
    contactPrefill.telephoneNumber = firstPhoneNumber;
  }

  if (hasValue(firstEmail)) {
    contactPrefill.personalEmail = firstEmail;
  }

  if (
    hasValue(residentialAddress) &&
    hasValue(permanentAddress) &&
    residentialAddress.toLowerCase() === permanentAddress.toLowerCase()
  ) {
    contactPrefill.sameAsResidentialAddress = 'true';
  }

  return contactPrefill;
}

function findNestedObjectByKeys(value: unknown, normalizedKeys: Set<string>): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nestedMatch = findNestedObjectByKeys(item, normalizedKeys);
      if (nestedMatch) {
        return nestedMatch;
      }
    }

    return null;
  }

  const source = value as Record<string, unknown>;

  for (const [key, nested] of Object.entries(source)) {
    if (normalizedKeys.has(normalizeKey(key)) && typeof nested === 'object' && nested !== null && !Array.isArray(nested)) {
      return nested as Record<string, unknown>;
    }
  }

  for (const nested of Object.values(source)) {
    const nestedMatch = findNestedObjectByKeys(nested, normalizedKeys);
    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

function getObjectFromSourcesByKeys(sources: unknown[], keys: string[]): Record<string, unknown> {
  const normalizedKeys = new Set(keys.map((key) => normalizeKey(key)));

  for (const source of sources) {
    const root = toObject(source);
    const nestedData = toObject(root.data);
    const nestedValue = toObject(root.value);
    const nestedResult = toObject(root.result);
    const nestedPayload = toObject(root.payload);

    const candidates: unknown[] = [source, root, nestedData, nestedValue, nestedResult, nestedPayload];
    for (const candidate of candidates) {
      const match = findNestedObjectByKeys(candidate, normalizedKeys);
      if (match) {
        return match;
      }
    }
  }

  return {};
}

function buildPersonSectionPrefill(
  person: Record<string, unknown>,
  fieldPrefix: 'nok' | 'spouse'
): Record<string, string> {
  if (Object.keys(person).length === 0) {
    return {};
  }

  const personContacts = Array.isArray(person.contacts) ? person.contacts : [];
  const personContactInformation = Array.isArray(person.contactInformation)
    ? person.contactInformation
    : [];
  const personContactInformations = Array.isArray(person.contactInformations)
    ? person.contactInformations
    : [];

  const contacts = [
    ...personContacts,
    ...personContactInformation,
    ...personContactInformations
  ].filter((entry): entry is Record<string, unknown> => {
    return Boolean(entry && typeof entry === 'object' && !Array.isArray(entry));
  });

  const residentialContact = contacts.find((contact) => {
    return toNormalizedString(contact.addressType).toLowerCase() === 'residential';
  }) || contacts[0];

  const sectionPrefill: Record<string, string> = {};
  const personId = toNormalizedString(person.id ?? person.personId ?? person.personID ?? person._id);
  const contactId = toNormalizedString(
    residentialContact?.id ?? residentialContact?.contactId ?? residentialContact?.contactID ?? residentialContact?._id
  );
  const contactAddress = toNormalizedString(
    residentialContact?.address ?? residentialContact?.residentialAddress
  );
  const contactPhoneNumber = toNormalizedString(
    residentialContact?.phoneNumber ?? residentialContact?.phone ?? residentialContact?.telephoneNumber
  );
  const personPhoneNumber = toNormalizedString(person.phoneNumber ?? person.phone ?? person.telephoneNumber);

  if (fieldPrefix === 'nok') {
    const nokTitle = toNormalizedString(person.title);
    const nokGender = toNormalizedString(person.gender);
    const nokSurname = toNormalizedString(person.surname ?? person.lastName);
    const nokFirstName = toNormalizedString(person.firstName);
    const nokOtherName = toNormalizedString(person.otherName ?? person.middleName);
    const nokRelationship = toNormalizedString(person.relationship);

    if (hasValue(nokTitle)) {
      sectionPrefill.nokTitle = nokTitle;
    }
    if (hasValue(nokGender)) {
      sectionPrefill.nokGender = nokGender;
    }
    if (hasValue(nokSurname)) {
      sectionPrefill.nokSurname = nokSurname;
    }
    if (hasValue(nokFirstName)) {
      sectionPrefill.nokFirstName = nokFirstName;
    }
    if (hasValue(nokOtherName)) {
      sectionPrefill.nokOtherName = nokOtherName;
    }
    if (hasValue(nokRelationship)) {
      sectionPrefill.nokRelationship = nokRelationship;
    }
    if (hasValue(personPhoneNumber || contactPhoneNumber)) {
      sectionPrefill.nokPhone = personPhoneNumber || contactPhoneNumber;
    }
    if (hasValue(contactAddress)) {
      sectionPrefill.nokAddress = contactAddress;
    }
    if (hasValue(personId)) {
      sectionPrefill.nokId = personId;
    }
    if (hasValue(contactId)) {
      sectionPrefill.nokContactId = contactId;
    }

    return sectionPrefill;
  }

  const spouseTitle = toNormalizedString(person.title);
  const spouseGender = toNormalizedString(person.gender);
  const spouseSurname = toNormalizedString(person.surname ?? person.lastName);
  const spouseFirstName = toNormalizedString(person.firstName);
  const spouseOtherName = toNormalizedString(person.otherName ?? person.middleName);
  const spouseRelationship = toNormalizedString(person.relationship);
  const spouseEmail = toNormalizedString(person.email ?? person.emailAddress);

  if (hasValue(spouseTitle)) {
    sectionPrefill.spouseTitle = spouseTitle;
  }
  if (hasValue(spouseGender)) {
    sectionPrefill.spouseGender = spouseGender;
  }
  if (hasValue(spouseSurname)) {
    sectionPrefill.spouseSurname = spouseSurname;
  }
  if (hasValue(spouseFirstName)) {
    sectionPrefill.spouseFirstName = spouseFirstName;
  }
  if (hasValue(spouseOtherName)) {
    sectionPrefill.spouseOtherName = spouseOtherName;
  }
  if (hasValue(spouseRelationship)) {
    sectionPrefill.spouseRelationship = spouseRelationship;
  }
  if (hasValue(personPhoneNumber || contactPhoneNumber)) {
    sectionPrefill.spousePhone = personPhoneNumber || contactPhoneNumber;
  }
  if (hasValue(spouseEmail)) {
    sectionPrefill.spouseEmail = spouseEmail;
  }
  if (hasValue(contactAddress)) {
    sectionPrefill.spouseAddress = contactAddress;
  }
  if (hasValue(personId)) {
    sectionPrefill.spouseId = personId;
  }
  if (hasValue(contactId)) {
    sectionPrefill.spouseContactId = contactId;
  }

  return sectionPrefill;
}

function buildRelatedPeoplePrefill(sources: unknown[]): Record<string, string> {
  const nextOfKin = getObjectFromSourcesByKeys(sources, ['nextOfKin', 'nextOfKinInformation']);
  const spouse = getObjectFromSourcesByKeys(sources, ['spouse']);

  return {
    ...buildPersonSectionPrefill(nextOfKin, 'nok'),
    ...buildPersonSectionPrefill(spouse, 'spouse')
  };
}

const PREFILL_FIELD_ALIASES: Record<string, string[]> = {
  title: ['title', 'personalInfo.title'],
  gender: ['gender', 'personalInfo.gender'],
  surname: ['surname', 'lastname', 'lastName', 'personalInfo.surname', 'personalInfo.lastName'],
  firstName: ['firstName', 'firstname', 'personalInfo.firstName'],
  otherName: ['otherName', 'middleName', 'personalInfo.middleName', 'personalInfo.otherName'],
  dateOfBirth: ['dateOfBirth', 'dob', 'personalInfo.dateOfBirth', 'personalInfo.dob'],
  nationality: ['nationality', 'country'],
  state: ['state', 'stateOfOrigin', 'stateName', 'personalInfo.state'],
  localGovernment: [
    'localGovernment',
    'localGovernmentArea',
    'lga',
    'lgaName',
    'personalInfo.localGovernment',
    'personalInfo.localGovernmentArea'
  ],
  localGovernmentArea: [
    'localGovernmentArea',
    'localGovernment',
    'lga',
    'lgaName',
    'personalInfo.localGovernmentArea',
    'personalInfo.localGovernment'
  ],
  maritalStatus: ['maritalStatus', 'personalInfo.maritalStatus'],
  religion: ['religion'],
  residentialAddress: ['residentialAddress', 'houseAddress', 'address', 'contactInfo.residentialAddress'],
  permanentAddress: ['permanentAddress', 'contactInfo.permanentAddress'],
  telephoneNumber: ['telephoneNumber', 'phoneNumber', 'phone', 'mobileNumber', 'contactInfo.phoneNumber'],
  personalEmail: ['personalEmail', 'employee.personalEmail', 'contactInfo.personalEmail'],
  emailAddress: ['emailAddress', 'workEmail', 'personalEmail', 'email', 'contactInfo.emailAddress'],
  nokTitle: ['nokTitle', 'nextOfKin.title'],
  nokGender: ['nokGender', 'nextOfKin.gender'],
  nokSurname: ['nokSurname', 'nextOfKin.surname', 'nextOfKin.lastName'],
  nokFirstName: ['nokFirstName', 'nextOfKin.firstName'],
  nokOtherName: ['nokOtherName', 'nextOfKin.otherName', 'nextOfKin.middleName'],
  nokRelationship: ['nokRelationship', 'nextOfKin.relationship'],
  nokPhone: ['nokPhone', 'nextOfKin.phone', 'nextOfKin.phoneNumber'],
  nokAddress: ['nokAddress', 'nextOfKin.address', 'nextOfKin.residentialAddress'],
  spouseSurname: ['spouseSurname', 'spouse.surname', 'spouse.lastName'],
  spouseFirstName: ['spouseFirstName', 'spouse.firstName'],
  spousePhone: ['spousePhone', 'spouse.phone', 'spouse.phoneNumber'],
  spouseEmail: ['spouseEmail', 'spouse.email'],
  spouseAddress: ['spouseAddress', 'spouse.address', 'spouse.residentialAddress'],
  accountDetailsId: [
    'accountDetailsId',
    'accountDetailId',
    'bankDetailsId',
    'accountDetails.0.id',
    'accountDetail.0.id',
    'bankDetails.id',
    'bankDetails.0.id'
  ],
  nin: ['nin', 'bankDetails.nin'],
  bvn: ['bvn', 'bankDetails.bvn'],
  bankName: ['bankName', 'bank', 'bankDetails.bankName'],
  accountNumber: ['accountNumber', 'bankDetails.accountNumber'],
  pfaHandler: ['pfaHandler', 'pfaName', 'pfa', 'hrOnboarding.pfa', 'bankDetails.pfaHandler'],
  pfaName: ['pfaName', 'pfaHandler', 'pfa', 'hrOnboarding.pfa'],
  pensionNumber: ['pensionNumber', 'pfaNumber', 'pfaPin', 'hrOnboarding.pfaNumber'],
  hmoName: ['hmoName', 'hmo', 'hrOnboarding.hmo'],
  hmoNumber: ['hmoNumber', 'hmoId', 'hrOnboarding.hmoNumber'],
  nhfNumber: ['nhfNumber', 'nhf', 'hrOnboarding.nhf'],
  taxIdentificationNumber: [
    'taxIdentificationNumber',
    'taxId',
    'taxID',
    'tin',
    'hrOnboarding.taxId',
    'bankDetails.taxIdentificationNumber'
  ],
  taxId: ['taxId', 'taxID', 'taxIdentificationNumber', 'tin', 'hrOnboarding.taxId'],
  schoolName: ['schoolName', 'education.schoolName'],
  courseOfStudy: ['courseOfStudy', 'education.courseOfStudy'],
  degree: ['degree', 'education.degree'],
  grade: ['grade', 'education.grade'],
  educationStartDate: ['educationStartDate', 'education.startDate'],
  educationEndDate: ['educationEndDate', 'education.endDate'],
  companyName: ['companyName', 'workHistory.companyName', 'employment.companyName'],
  position: ['position', 'jobTitle', 'workHistory.position'],
  address: ['address', 'workHistory.address', 'workHistory.officeAddress'],
  phoneNumber: ['phoneNumber', 'workHistory.phoneNumber', 'workHistory.officePhoneNumber'],
  startDate: ['startDate', 'workHistory.startDate', 'workStartDate'],
  endDate: ['endDate', 'workHistory.endDate', 'workEndDate'],
  officeAddress: ['officeAddress', 'workHistory.officeAddress'],
  officePhoneNumber: ['officePhoneNumber', 'workHistory.officePhoneNumber'],
  officeEmail: ['officeEmail', 'workHistory.officeEmail', 'emailAddress', 'workHistory.emailAddress'],
  workStartDate: ['workStartDate', 'workHistory.startDate'],
  workEndDate: ['workEndDate', 'workHistory.endDate'],
  referee1Id: ['referee1Id', 'referee1.id', 'referees.0.id'],
  referee1FullName: ['referee1FullName', 'referee1.fullName', 'referees.0.fullName'],
  referee1Email: ['referee1Email', 'referee1.email', 'referee1.emailAddress', 'referees.0.email', 'referees.0.emailAddress'],
  referee1Address: [
    'referee1Address',
    'referee1.address',
    'referee1.residentialAddress',
    'referees.0.address',
    'referees.0.residentialAddress'
  ],
  referee1Phone: ['referee1Phone', 'referee1.phone', 'referees.0.phoneNumber'],
  referee1Relationship: ['referee1Relationship', 'referee1.relationship', 'referees.0.relationship'],
  referee2Id: ['referee2Id', 'referee2.id', 'referees.1.id'],
  referee2FullName: ['referee2FullName', 'referee2.fullName', 'referees.1.fullName'],
  referee2Email: ['referee2Email', 'referee2.email', 'referee2.emailAddress', 'referees.1.email', 'referees.1.emailAddress'],
  referee2Address: [
    'referee2Address',
    'referee2.address',
    'referee2.residentialAddress',
    'referees.1.address',
    'referees.1.residentialAddress'
  ],
  referee2Phone: ['referee2Phone', 'referee2.phone', 'referees.1.phoneNumber'],
  referee2Relationship: ['referee2Relationship', 'referee2.relationship', 'referees.1.relationship']
};

export function extractEmployeeId(source: unknown): string {
  const candidates = new Map<string, string>();
  collectCandidates(source, [], candidates);

  return (
    readAlias(candidates, ['employeeId', 'employeeID', 'id', 'sub']) ||
    readAlias(candidates, ['employee.id'])
  );
}

export function buildOnboardingPrefillData(...sources: unknown[]): Record<string, string> {
  const candidates = new Map<string, string>();

  sources.forEach((source) => {
    const root = toObject(source);
    const nestedData = toObject(root.data);
    const nestedValue = toObject(root.value);

    collectCandidates(source, [], candidates);
    collectCandidates(root, [], candidates);
    collectCandidates(nestedData, [], candidates);
    collectCandidates(nestedValue, [], candidates);
  });

  const prefill: Record<string, string> = {};
  Object.entries(PREFILL_FIELD_ALIASES).forEach(([field, aliases]) => {
    const value = readAlias(candidates, [field, ...aliases]);
    if (value) {
      prefill[field] = value;
    }
  });

  const contactPrefill = buildContactPrefill(sources);
  Object.entries(contactPrefill).forEach(([field, value]) => {
    if (value) {
      prefill[field] = value;
    }
  });

  const relatedPeoplePrefill = buildRelatedPeoplePrefill(sources);
  Object.entries(relatedPeoplePrefill).forEach(([field, value]) => {
    if (value) {
      prefill[field] = value;
    }
  });

  const educationHistoryEntries = buildEducationHistoryEntriesPrefill(sources);
  if (educationHistoryEntries) {
    prefill.educationHistoryEntries = educationHistoryEntries;
  }

  const workHistoryEntries = buildWorkHistoryEntriesPrefill(sources);
  if (workHistoryEntries) {
    prefill.workHistoryEntries = workHistoryEntries;
  }

  if (educationHistoryEntries) {
    try {
      const parsed = JSON.parse(educationHistoryEntries) as Array<{ id?: string }>;
      const firstId = toNormalizedString(parsed[0]?.id);
      if (firstId) {
        prefill.educationHistoryId = firstId;
      }
    } catch {
      // Ignore parse issues and continue with remaining prefill fields.
    }
  }

  if (workHistoryEntries) {
    try {
      const parsed = JSON.parse(workHistoryEntries) as Array<{ id?: string }>;
      const firstId = toNormalizedString(parsed[0]?.id);
      if (firstId) {
        prefill.workHistoryId = firstId;
      }
    } catch {
      // Ignore parse issues and continue with remaining prefill fields.
    }
  }

  return prefill;
}
