import { AppData } from '../types';

const STORAGE_KEY = 'fh_house_magazine_data';

const initialData: AppData = {
  writings: [],
  officials: [
    { id: '1', name: '', designation: 'Principal' },
    { id: '2', name: '', designation: 'Vice Principal' },
    { id: '3', name: '', designation: 'Adjutant' },
    { id: '4', name: '', designation: 'Medical Officer' },
    { id: '5', name: '', designation: 'House Master FH' },
    { id: '6', name: '', designation: 'House Master SH' },
    { id: '7', name: '', designation: 'House Master NH' },
    { id: '8', name: '', designation: 'CSC OIC' },
  ],
  contributors: [],
  editorial: { content: '' },
  pictureCorner: [],
  comments: [],
};

export const storage = {
  getData: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialData;
  },
  saveData: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
};
