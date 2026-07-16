type StoredData<T> = {
  value: T;
  date: string;
};

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}


export function saveDailyData<T>(
  key: string,
  value: T
): void {
  const data: StoredData<T> = {
    value,
    date: getTodayKey(),
  };

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}


export function getDailyData<T>(
  key: string
): T | null {
  const stored = localStorage.getItem(key);

  if (!stored) {
    return null;
  }

  try {
    const data: StoredData<T> = JSON.parse(stored);

    if (data.date !== getTodayKey()) {
      localStorage.removeItem(key);
      return null;
    }

    return data.value;

  } catch {
    localStorage.removeItem(key);
    return null;
  }
}


export function removeDailyData(
  key: string
): void {
  localStorage.removeItem(key);
}