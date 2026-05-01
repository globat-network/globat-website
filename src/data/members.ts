import { google } from "googleapis";

const SPREADSHEET_ID = import.meta.env.MEMBER_SPREADSHEET_ID;
const SPREADSHEET_RANGE = import.meta.env.MEMBER_SPREADSHEET_RANGE;

export interface MemberInfo {
  timestamp: string;
  role: string;
  country: string;
  areas_of_study: string[];
  area_of_interest: string;
  specific_interests: string[];
  skills: string[];
}

let cache: Promise<MemberInfo[]> | null = null;

function parseSkills(skills: string): string[] {
  // strip
  skills = skills.trim();

  return skills.split(",").map((skill) => skill.trim());
}

function parseCountry(country: string): string {
  country = country.trim();

  let country_mapping: Record<string, string> = {
    UK: "United Kingdom",
    USA: "United States",
    Türkiye: "Turkey",
    Vietnam: "Viet Nam",
  };

  return country_mapping[country] || country;
}

function parseAreaOfStudy(areaOfStudy: string): string[] {
  // strip
  areaOfStudy = areaOfStudy.trim();

  // replace parens, colons and " and " with commas
  const areas = areaOfStudy.replace(/\(|\)|:/g, ",").replace(" and ", ",");

  // split on commas
  return areas.split(",").map(
    // For each area, strip the empty spaces and quotes
    (area) =>
      area.replace(/"/g, "").replace(/'/g, "").replace(/\./g, "").trim(),
  );
}

export async function downloadAndParseMembers() {
  const credentialsJson = import.meta.env.GCP_SERVICE_ACCOUNT_KEY;
  if (!credentialsJson) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY environment variable not set!");
  }

  const credentials = JSON.parse(credentialsJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SPREADSHEET_RANGE,
  });

  const rows = response.data.values;

  if (!rows) {
    throw new Error("No data found in the spreadsheet range.");
  }

  return rows.map((row: any) => ({
    timestamp: row[0],
    role: row[4],
    country: parseCountry(row[5]),
    areas_of_study: parseAreaOfStudy(row[6]),
    area_of_interest: row[7],
    specific_interests: row[8],
    skills: parseSkills(row[9]),
  }));
}

export async function getMembers(): Promise<MemberInfo[]> {
  if (!cache) {
    cache = downloadAndParseMembers();
    return cache;
  }
  return cache;
}

export function getMemberCountsByCountry(members: MemberInfo[]): {
  [country: string]: number;
} {
  const countries = members.map((member) => member.country);

  // Use reduce to count occurrences of each country
  return countries.reduce(
    (acc, country) => {
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as { [country: string]: number },
  );
}
