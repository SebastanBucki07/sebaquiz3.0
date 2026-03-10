import clubDataRaw from '../../../public/footballCrests/mappedClubs.json';

const ASSETS_PATH = 'footballCrests/';

const clubData = clubDataRaw as Record<string, string>;

const fileToName: Record<string, string> = Object.fromEntries(
  Object.entries(clubData).map(([name, file]) => [file, name])
);

export const getClubInfo = (input: string) => {
  const formatLogoPath = (fileName: string) => `${ASSETS_PATH}${fileName}`;

  if (clubData[input]) {
    return {
      name: input,
      logo: formatLogoPath(clubData[input]),
    };
  }

  if (fileToName[input]) {
    return {
      name: fileToName[input],
      logo: formatLogoPath(input),
    };
  }

  return {
    name: input,
    logo: formatLogoPath('default-logo.png'),
  };
};
