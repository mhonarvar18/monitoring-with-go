import moment from "moment-jalaali";

export const convertToJalaali = (dateString: string): string => {
  const m = moment(dateString);
  // if it's exactly YYYY-MM-DD (no time part)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return m.format("jYYYY/jMM/jDD");
  }
  // otherwise include the time
  return m.format("jYYYY/jMM/jDD - HH:mm:ss");
};
