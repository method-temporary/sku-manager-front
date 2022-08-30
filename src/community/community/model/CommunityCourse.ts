interface Creator {
  name: string;
}
interface Category {
  college: {
    name: string;
  };
  channel: {
    name: string;
  };
}

export interface CommunityCourse {
  coursePlanId: string;
  name: string;
  category: Category;
  time: number;
  creator: Creator;
}
