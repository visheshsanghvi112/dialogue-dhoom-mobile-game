
import { Dialogue, Difficulty, Player } from "@/types/gameTypes";

// Sample players for testing
export const samplePlayers: Player[] = [
  {
    id: "p1",
    name: "Amitabh",
    avatar: "👨‍🦳",
    score: 0,
    isHost: true,
  },
  {
    id: "p2",
    name: "Shahrukh",
    avatar: "👨",
    score: 0,
  },
  {
    id: "p3",
    name: "Deepika",
    avatar: "👩",
    score: 0,
  },
  {
    id: "p4",
    name: "Aamir",
    avatar: "👨‍🦱",
    score: 0,
  },
];

// Sample dialogues for different difficulty levels
export const sampleDialogues: Record<Difficulty, Dialogue[]> = {
  easy: [
    {
      id: "e1",
      text: "Kitne aadmi the?",
      movie: "Sholay",
      options: ["Sholay", "Don", "Deewar", "Zanjeer"],
      correctAnswer: "Sholay",
      hint: "Gabbar Singh is the villain",
      category: "villain",
      difficulty: "easy",
    },
    {
      id: "e2",
      text: "Mere paas maa hai.",
      movie: "Deewar",
      options: ["Deewar", "Sholay", "Amar Akbar Anthony", "Agneepath"],
      correctAnswer: "Deewar",
      hint: "Amitabh and Shashi Kapoor are brothers",
      category: "hero",
      difficulty: "easy",
    },
    {
      id: "e3",
      text: "Don ko pakadna mushkil hi nahi, namumkin hai.",
      movie: "Don",
      options: ["Don", "Agneepath", "Race", "Dhoom"],
      correctAnswer: "Don",
      hint: "Shah Rukh Khan remake of Amitabh classic",
      category: "villain",
      difficulty: "easy",
    },
    {
      id: "e4",
      text: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hai.",
      movie: "Dilwale Dulhania Le Jayenge",
      options: ["Dilwale Dulhania Le Jayenge", "Kuch Kuch Hota Hai", "Kabhi Khushi Kabhie Gham", "Mohabbatein"],
      correctAnswer: "Dilwale Dulhania Le Jayenge",
      hint: "DDLJ - Raj and Simran in Europe",
      category: "romantic",
      difficulty: "easy",
    },
    {
      id: "e5",
      text: "Mogambo khush hua!",
      movie: "Mr. India",
      options: ["Mr. India", "Shaan", "Karma", "Don"],
      correctAnswer: "Mr. India",
      hint: "Anil Kapoor has an invisibility device",
      category: "villain",
      difficulty: "easy",
    },
  ],
  medium: [
    {
      id: "m1",
      text: "Tension lene ka nahi, sirf dene ka.",
      movie: "Gunda",
      options: ["Gunda", "Loafer", "Khiladi", "Baaghi"],
      correctAnswer: "Gunda",
      hint: "Mithun Chakraborty cult classic",
      category: "hero",
      difficulty: "medium",
    },
    {
      id: "m2",
      text: "Thapad se darr nahi lagta sahab, pyaar se lagta hai.",
      movie: "Dabangg",
      options: ["Dabangg", "Singham", "Rowdy Rathore", "Wanted"],
      correctAnswer: "Dabangg",
      hint: "Salman Khan plays Chulbul Pandey",
      category: "hero",
      difficulty: "medium",
    },
    {
      id: "m3",
      text: "Rishte mein to hum tumhare baap lagte hain, naam hai Shahenshah.",
      movie: "Shahenshah",
      options: ["Shahenshah", "Agneepath", "Tezaab", "Aankhen"],
      correctAnswer: "Shahenshah",
      hint: "Amitabh has a metal arm",
      category: "hero",
      difficulty: "medium",
    },
    {
      id: "m4",
      text: "Utha le re baba, utha le. Mereko nahi, in dono ko utha le.",
      movie: "Hera Pheri",
      options: ["Hera Pheri", "Golmaal", "Awara Pagal Deewana", "Phir Hera Pheri"],
      correctAnswer: "Hera Pheri",
      hint: "Babu Bhaiya, Shyam, and Raju",
      category: "comedy",
      difficulty: "medium",
    },
    {
      id: "m5",
      text: "Sara sheher mujhe lion ke naam se jaanta hai.",
      movie: "Kaante",
      options: ["Kaante", "Company", "Shootout at Lokhandwala", "Don"],
      correctAnswer: "Kaante",
      hint: "Remake of Reservoir Dogs",
      category: "villain",
      difficulty: "medium",
    },
  ],
  hard: [
    {
      id: "h1",
      text: "Taareekh pe taareekh, taareekh pe taareekh, taareekh pe taareekh milti gayi, lekin insaaf nahi mila.",
      movie: "Damini",
      options: ["Damini", "Ghayal", "Andha Kanoon", "Satyamev Jayate"],
      correctAnswer: "Damini",
      hint: "Sunny Deol fights for justice",
      category: "hero",
      difficulty: "hard",
    },
    {
      id: "h2",
      text: "Crime Master Gogo naam hai mera, aankhen nikaal ke gotiyan khelta hoon main.",
      movie: "Andaz Apna Apna",
      options: ["Andaz Apna Apna", "Aankhen", "Baadshah", "Dulhe Raja"],
      correctAnswer: "Andaz Apna Apna",
      hint: "Shakti Kapoor's iconic character",
      category: "comedy",
      difficulty: "hard",
    },
    {
      id: "h3",
      text: "Aaj ek hasi aur baant lo, aaj ek dua aur maang lo, aaj ek aansu aur pee lo, aaj ek zindagi aur jee lo, aaj ek sapna aur dekh lo, aaj... kya pata, kal ho na ho.",
      movie: "Kal Ho Naa Ho",
      options: ["Kal Ho Naa Ho", "Dil To Pagal Hai", "Dil Chahta Hai", "Kuch Kuch Hota Hai"],
      correctAnswer: "Kal Ho Naa Ho",
      hint: "Shah Rukh Khan has a heart condition",
      category: "romantic",
      difficulty: "hard",
    },
    {
      id: "h4",
      text: "Haar kar jeetne wale ko baazigar kehte hain.",
      movie: "Baazigar",
      options: ["Baazigar", "Darr", "Anjaam", "Khalnayak"],
      correctAnswer: "Baazigar",
      hint: "Shah Rukh Khan's anti-hero role",
      category: "villain",
      difficulty: "hard",
    },
    {
      id: "h5",
      text: "Babumoshai, zindagi badi honi chahiye, lambi nahi.",
      movie: "Anand",
      options: ["Anand", "Namak Haraam", "Mili", "Bawarchi"],
      correctAnswer: "Anand",
      hint: "Rajesh Khanna has cancer",
      category: "hero",
      difficulty: "hard",
    },
  ],
};

// Generate a random room code
export const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get a random dialogue based on difficulty
export const getRandomDialogue = (difficulty: Difficulty): Dialogue => {
  const dialogues = sampleDialogues[difficulty];
  return dialogues[Math.floor(Math.random() * dialogues.length)];
};

// Determine difficulty based on round number
export const getDifficultyForRound = (round: number): Difficulty => {
  if (round <= 3) return 'easy';
  if (round <= 6) return 'medium';
  return 'hard';
};
