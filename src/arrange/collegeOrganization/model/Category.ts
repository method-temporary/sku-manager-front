import { IdName } from "@nara.platform/accent";

export default interface Category {
  college: IdName;
  channel: IdName;
}

export function getCategory(college: IdName, channel: IdName): Category {
  return {
    college,
    channel,
  };
}