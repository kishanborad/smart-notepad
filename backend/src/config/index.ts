// Configuration constants
export const JWT_SECRET = process.env.JWT_SECRET || 'ade57c924ec34a8bde5affae7e74058c92cd637163c63fc3f939bec000e8279d1ddeda7a289a2cff59d6a890d8aabe06cd9e9cb0af541a4cbf9aa8f530db42ff2bbe21e582784512e4b5aa25ded5725494eda2e48cec8289650bb71a39a05c71dc62eda4f521eb2dd3837bcab22e964cb2d3e2fba658548f9d10541f3f7a0e0865b6c0b9dd5fe1d4742c5ba9378bef76151ed427319783d1c533113413c5140d379f52feecdc1487e3587c31734547cfcbeadf35445ace253c9a23099a030b5fcb90533dec3f3f7435a026da8f438bd189b19174904dad969b90c9b7d68c688ccd03ab9cd549cc1baed1cbac3a5c0bc572455c69dea66e92bb6e10c2d9a8d309';
export const PORT = process.env.PORT || 5050;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-notepad';

// Configuration interface
export interface Config {
  JWT_SECRET: string;
  PORT: number;
  MONGODB_URI: string;
}

// Configuration object
const config: Config = {
  JWT_SECRET,
  PORT: Number(PORT),
  MONGODB_URI,
};

export default config; 