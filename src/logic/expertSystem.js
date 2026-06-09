import { exerciseData } from './exerciseData';

export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(2);
};

export const classifyBMI = (bmi) => {
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi >= 18.5 && bmi <= 24.9) return 'Berat Badan Normal';
  if (bmi >= 25 && bmi <= 29.9) return 'Berat Badan Lebih';
  return 'Obesitas';
};

// Karakteristik Latihan Berdasarkan Tujuan
export const getGoalCharacteristics = (goal) => {
  switch (goal) {
    case 'Fat Loss':
      return {
        intensitas: 'Sedang - Tinggi (Fokus Detak Jantung)',
        repetisi: '12-15 Repetisi/Set, Waktu Istirahat Singkat (30-45 detik).',
        karakteristik: 'Latihan terasa seperti kardio ringan yang efektif membakar kalori secara maksimal.'
      };
    case 'Muscle Gain':
      return {
        intensitas: 'Sedang - Tinggi (Penambahan Beban Progresif)',
        repetisi: '8-12 Repetisi/Set, Waktu Istirahat Cukup (60-90 detik).',
        karakteristik: 'Beban menantang merangsang otot dengan pemulihan tenaga maksimal antar set.'
      };
    case 'Maintenance':
      return {
        intensitas: 'Rendah - Sedang',
        repetisi: '10-12 Repetisi/Set, Waktu Istirahat Fleksibel (60 detik).',
        karakteristik: 'Beban tidak dipaksakan ke titik failure, fokus pada recovery cepat tanpa terlalu lelah.'
      };
    default:
      return { intensitas: '-', repetisi: '-', karakteristik: '-' };
  }
};

export const evaluateProgram = (bmiCategory, goal) => {
  // BMI Categories: 'Berat Badan Kurang', 'Berat Badan Normal', 'Berat Badan Lebih', 'Obesitas'
  
  if (bmiCategory === 'Berat Badan Kurang') {
    if (goal === 'Fat Loss') {
      return {
        program: 'Tujuan Tidak Valid (Fat Loss Dilarang)',
        description: 'Sangat tidak sehat menurunkan berat badan saat kondisi kurang (underweight). Fokus utamanya adalah menambah massa dan gizi.',
        kardio: '-'
      };
    } else if (goal === 'Muscle Gain') {
      return {
        program: 'Program Pembangunan Massa Otot Ekstrim (Bulking)',
        description: 'Nutrisi: Wajib Surplus Kalori Tinggi (Makan banyak) + Protein Tinggi.',
        kardio: 'Kardio Ringan: Sekitar 10 menit hanya murni untuk pemanasan dan kesehatan jantung. Fokuskan 100% tenaga pada angkat beban.'
      };
    } else { // Maintenance
      return {
        program: 'Program Peningkatan Kebugaran Dasar',
        description: 'Nutrisi: Penuhi Kalori Harian Normal (jangan defisit/tanpa surplus) + Penuhi protein harian standar.',
        kardio: 'Kardio Ringan: 10 menit untuk menjaga fungsi kardiovaskular.'
      };
    }
  }

  if (bmiCategory === 'Berat Badan Normal') {
    if (goal === 'Muscle Gain') {
      return {
        program: 'Program Tumbuh Otot Ideal (Lean Bulking)',
        description: 'Nutrisi: Surplus Kalori Ringan (jangan terlalu banyak agar lemak tidak menumpuk) + Fokus utama penambahan porsi Protein.',
        kardio: 'Kardio Ringan: Sekitar 10 menit, murni untuk pemanasan saja.'
      };
    } else if (goal === 'Fat Loss') {
      return {
        program: 'Program Definisi Otot (Cutting)',
        description: 'Nutrisi: Wajib Defisit Kalori + Penuhi Protein Harian (agar otot tidak ikut menyusut saat kalori dikurangi).',
        kardio: 'Kardio Ringan-Sedang: Rutin berjalan kaki atau kardio sedang untuk memastikan target kalori tercapai.'
      };
    } else {
      return {
        program: 'Program Pemeliharaan',
        description: 'Nutrisi: Penuhi Kalori Harian Rata-rata (Normal) tanpa defisit. Penuhi Protein Harian standar.',
        kardio: 'Kardio Ringan-Sedang: Rutin sesuai kebutuhan untuk kesehatan jantung.'
      };
    }
  }

  // Berat Badan Lebih & Obesitas
  if (goal === 'Fat Loss') {
    return {
      program: 'Program Penurunan Lemak Maksimal',
      description: 'Nutrisi: WAJIB Defisit Kalori + Penuhi Protein Harian untuk meminimalisasi penyusutan massa otot.',
      kardio: 'HIIT / Kardio Intens: 30-45 Menit di sesi akhir atau di luar jam latihan beban. (Contoh HIIT: Lari sprint cepat 30 detik, jalan santai 1 menit, diulang-ulang).'
    };
  } else if (goal === 'Muscle Gain') {
    return {
      program: 'Program Rekomposisi Tubuh (Body Recomposition)',
      description: 'Nutrisi: TIDAK BOLEH SURPLUS KALORI. Defisit atau minimal kalori harian normal + PROTEIN SANGAT TINGGI. Lemak tubuh akan diserap sebagai energi untuk membentuk otot.',
      kardio: 'Kardio Konstan: 15-30 menit kardio konstan (sepeda statis/jogging ringan) setiap hari latihan agar metabolisme tetap aktif.'
    };
  } else {
    return {
      program: 'Program Pemeliharaan Aktif',
      description: 'Nutrisi: Kalori Normal Harian (jangan melebihi) + Penuhi Protein Standar.',
      kardio: 'Kardio Rutin: 20-30 menit untuk menjaga stabilitas metabolisme tubuh.'
    };
  }
};

export const generateSchedule = (frequency, goal) => {
  const dataset = exerciseData[goal] || exerciseData['Muscle Gain'];
  const chars = getGoalCharacteristics(goal);
  
  // Create an informative set/rep string to append
  let repsInfo = "";
  if (goal === 'Muscle Gain') repsInfo = " (3-4 Set x 8-12 Rep)";
  else if (goal === 'Fat Loss') repsInfo = " (3-4 Set x 12-15 Rep)";
  else repsInfo = " (3 Set x 10-12 Rep)";

  const getExcObj = (muscle, count = 2) => {
    let list = dataset[muscle] || [];
    return list.slice(0, count).map(e => `${e}${repsInfo}`);
  };

  const schedule = [];
  const freqNum = parseInt(frequency, 10);
  
  if (freqNum === 3) {
    schedule.push({ day: 1, target: "Dada & Trisep", exercises: [...getExcObj('Dada', 3), ...getExcObj('Trisep', 2)] });
    schedule.push({ day: 2, target: "Punggung & Bisep", exercises: [...getExcObj('Punggung', 3), ...getExcObj('Bisep', 2)] });
    schedule.push({ day: 3, target: "Kaki, Bahu & Core", exercises: [...getExcObj('Kaki', 3), ...getExcObj('Bahu', 2), ...getExcObj('Core', 1)] });
  } else if (freqNum === 4) {
    schedule.push({ day: 1, target: "Dada & Trisep", exercises: [...getExcObj('Dada', 3), ...getExcObj('Trisep', 2)] });
    schedule.push({ day: 2, target: "Punggung & Bisep", exercises: [...getExcObj('Punggung', 3), ...getExcObj('Bisep', 2)] });
    schedule.push({ day: 3, target: "Kaki & Core", exercises: [...getExcObj('Kaki', 4), ...getExcObj('Core', 2)] });
    schedule.push({ day: 4, target: "Bahu & Full Body", exercises: [...getExcObj('Bahu', 3), "Kardio Ekstra (Sesuai Anjuran)"] });
  } else if (freqNum === 5) {
    schedule.push({ day: 1, target: "Dada", exercises: getExcObj('Dada', 4) });
    schedule.push({ day: 2, target: "Punggung", exercises: getExcObj('Punggung', 4) });
    schedule.push({ day: 3, target: "Kaki", exercises: getExcObj('Kaki', 5) });
    schedule.push({ day: 4, target: "Bahu & Trisep", exercises: [...getExcObj('Bahu', 3), ...getExcObj('Trisep', 2)] });
    schedule.push({ day: 5, target: "Bisep & Core", exercises: [...getExcObj('Bisep', 2), ...getExcObj('Core', 3)] });
  } else { 
    // 6 Days (Push/Pull/Legs x2 variant)
    schedule.push({ day: 1, target: "Dada & Trisep", exercises: [...getExcObj('Dada', 3), ...getExcObj('Trisep', 2)] });
    schedule.push({ day: 2, target: "Punggung & Bisep", exercises: [...getExcObj('Punggung', 3), ...getExcObj('Bisep', 2)] });
    schedule.push({ day: 3, target: "Kaki & Core", exercises: [...getExcObj('Kaki', 4), ...getExcObj('Core', 2)] });
    schedule.push({ day: 4, target: "Bahu & Dada Atas", exercises: [...getExcObj('Bahu', 3), `Incline Bench Press${repsInfo}`] });
    schedule.push({ day: 5, target: "Punggung & Lengan", exercises: [...getExcObj('Punggung', 2), ...getExcObj('Bisep', 2), ...getExcObj('Trisep', 2)] });
    schedule.push({ day: 6, target: "Kaki & Core", exercises: [...getExcObj('Kaki', 4), ...getExcObj('Core', 2)] });
  }

  return schedule;
};

export const getExpertRecommendation = (weight, height, goal, frequency) => {
  const bmi = calculateBMI(weight, height);
  const category = classifyBMI(bmi);
  const programAdvice = evaluateProgram(category, goal);
  const dailySchedule = generateSchedule(frequency, goal);
  const chars = getGoalCharacteristics(goal);

  return {
    bmi,
    category,
    ...programAdvice,
    ...chars,
    dailySchedule,
    split: frequency + " Hari Aktif",
    details: "Daftar di bawah adalah rotasi hari aktif Anda. Anda sangat disarankan mengambil hari istirahat 1-2 hari per minggu (Rest Day) bebas di antara daftar harian ini sesuai kapasitas pemulihan tubuh Anda."
  };
};
