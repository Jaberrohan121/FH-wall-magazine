export type WritingCategory = 'Poem' | 'Story' | 'Drama' | 'Essay' | 'Article' | 'Miscellaneous';

export interface Score {
  creativity: number;
  language: number;
  presentation: number;
  overall: number;
  total: number;
  judgeName: string;
}

export interface Writing {
  id: string;
  title: string;
  writerName: string;
  cadetNumber: string;
  category: WritingCategory;
  content: string;
  imageUrl?: string;
  type: 'Bangla' | 'English';
  scores: Score[];
  votes: number;
  createdAt: number;
}

export interface Official {
  id: string;
  name: string;
  designation: string;
  photoUrl?: string;
}

export interface Contributor {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  role: string;
}

export interface Editorial {
  content: string;
  backgroundImageUrl?: string;
}

export interface Comment {
  id: string;
  role: string;
  judgeName?: string;
  text: string;
  createdAt: number;
}

export interface AppData {
  writings: Writing[];
  officials: Official[];
  contributors: Contributor[];
  editorial: Editorial;
  mainMagazineImage?: string;
  mainMagazinePdfUrl?: string;
  pictureCorner: string[];
  comments: Comment[];
}
