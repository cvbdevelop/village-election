// src/utils/khmerFont.js

export const loadKhmerFont = async () => {
  try {
    const response = await fetch('/NotoSansKhmer-Regular.ttf');

    if (!response.ok) {
      console.error('❌ Font file not found! Status:', response.status);
      return null;
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading Khmer font:', error);
    return null;
  }
};