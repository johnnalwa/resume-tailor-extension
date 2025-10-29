import browser from 'webextension-polyfill';

/**
 * Storage keys used by the extension
 */
const STORAGE_KEYS = {
  RESUME: 'resume',
  TONE: 'tone',
  API_KEY: 'apiKey',
  COVER_LETTERS: 'coverLetters',
  SETTINGS: 'settings'
};

/**
 * Get all settings from storage
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings() {
  try {
    const result = await browser.storage.local.get([
      STORAGE_KEYS.RESUME,
      STORAGE_KEYS.TONE,
      STORAGE_KEYS.API_KEY
    ]);

    return {
      resume: result[STORAGE_KEYS.RESUME] || null,
      tone: result[STORAGE_KEYS.TONE] || 'professional',
      apiKey: result[STORAGE_KEYS.API_KEY] || ''
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      resume: null,
      tone: 'professional',
      apiKey: ''
    };
  }
}

/**
 * Save settings to storage
 * @param {Object} settings - Settings to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveSettings(settings) {
  try {
    const dataToSave = {};

    if (settings.resume !== undefined) {
      dataToSave[STORAGE_KEYS.RESUME] = settings.resume;
    }

    if (settings.tone !== undefined) {
      dataToSave[STORAGE_KEYS.TONE] = settings.tone;
    }

    if (settings.apiKey !== undefined) {
      dataToSave[STORAGE_KEYS.API_KEY] = settings.apiKey;
    }

    await browser.storage.local.set(dataToSave);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

/**
 * Get resume from storage
 * @returns {Promise<Object|null>} Resume object or null
 */
export async function getResume() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.RESUME);
    return result[STORAGE_KEYS.RESUME] || null;
  } catch (error) {
    console.error('Error getting resume:', error);
    return null;
  }
}

/**
 * Save resume to storage
 * @param {Object} resume - Resume object
 * @returns {Promise<boolean>} Success status
 */
export async function saveResume(resume) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.RESUME]: resume });
    return true;
  } catch (error) {
    console.error('Error saving resume:', error);
    return false;
  }
}

/**
 * Delete resume from storage
 * @returns {Promise<boolean>} Success status
 */
export async function deleteResume() {
  try {
    await browser.storage.local.remove(STORAGE_KEYS.RESUME);
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

/**
 * Get tone preference from storage
 * @returns {Promise<string>} Tone preference
 */
export async function getTone() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.TONE);
    return result[STORAGE_KEYS.TONE] || 'professional';
  } catch (error) {
    console.error('Error getting tone:', error);
    return 'professional';
  }
}

/**
 * Save tone preference to storage
 * @param {string} tone - Tone preference
 * @returns {Promise<boolean>} Success status
 */
export async function saveTone(tone) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.TONE]: tone });
    return true;
  } catch (error) {
    console.error('Error saving tone:', error);
    return false;
  }
}

/**
 * Get API key from storage
 * @returns {Promise<string>} API key
 */
export async function getApiKey() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.API_KEY);
    return result[STORAGE_KEYS.API_KEY] || '';
  } catch (error) {
    console.error('Error getting API key:', error);
    return '';
  }
}

/**
 * Save API key to storage
 * @param {string} apiKey - API key
 * @returns {Promise<boolean>} Success status
 */
export async function saveApiKey(apiKey) {
  try {
    await browser.storage.local.set({ [STORAGE_KEYS.API_KEY]: apiKey });
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
}

/**
 * Save a generated cover letter to history
 * @param {Object} coverLetter - Cover letter object
 * @returns {Promise<boolean>} Success status
 */
export async function saveCoverLetterToHistory(coverLetter) {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.COVER_LETTERS);
    const coverLetters = result[STORAGE_KEYS.COVER_LETTERS] || [];

    const newCoverLetter = {
      id: Date.now().toString(),
      content: coverLetter.content,
      jobTitle: coverLetter.jobTitle || 'Untitled',
      createdAt: new Date().toISOString(),
      tone: coverLetter.tone || 'professional'
    };

    coverLetters.unshift(newCoverLetter);

    // Keep only the last 20 cover letters
    const trimmedCoverLetters = coverLetters.slice(0, 20);

    await browser.storage.local.set({ [STORAGE_KEYS.COVER_LETTERS]: trimmedCoverLetters });
    return true;
  } catch (error) {
    console.error('Error saving cover letter to history:', error);
    return false;
  }
}

/**
 * Get cover letter history
 * @returns {Promise<Array>} Array of cover letters
 */
export async function getCoverLetterHistory() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.COVER_LETTERS);
    return result[STORAGE_KEYS.COVER_LETTERS] || [];
  } catch (error) {
    console.error('Error getting cover letter history:', error);
    return [];
  }
}

/**
 * Delete a cover letter from history
 * @param {string} id - Cover letter ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteCoverLetterFromHistory(id) {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.COVER_LETTERS);
    const coverLetters = result[STORAGE_KEYS.COVER_LETTERS] || [];

    const filteredCoverLetters = coverLetters.filter(cl => cl.id !== id);

    await browser.storage.local.set({ [STORAGE_KEYS.COVER_LETTERS]: filteredCoverLetters });
    return true;
  } catch (error) {
    console.error('Error deleting cover letter from history:', error);
    return false;
  }
}

/**
 * Clear all storage data
 * @returns {Promise<boolean>} Success status
 */
export async function clearAllData() {
  try {
    await browser.storage.local.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Get storage usage information
 * @returns {Promise<Object>} Storage usage info
 */
export async function getStorageInfo() {
  try {
    const bytesInUse = await browser.storage.local.getBytesInUse();
    const allData = await browser.storage.local.get(null);

    return {
      bytesInUse,
      itemCount: Object.keys(allData).length,
      items: Object.keys(allData)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      bytesInUse: 0,
      itemCount: 0,
      items: []
    };
  }
}

export default {
  getSettings,
  saveSettings,
  getResume,
  saveResume,
  deleteResume,
  getTone,
  saveTone,
  getApiKey,
  saveApiKey,
  saveCoverLetterToHistory,
  getCoverLetterHistory,
  deleteCoverLetterFromHistory,
  clearAllData,
  getStorageInfo,
  STORAGE_KEYS
};
