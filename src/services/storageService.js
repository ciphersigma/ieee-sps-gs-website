// services/storageService.js
import { supabase } from './supabase';

// The name of your storage bucket - change this if needed
export const STORAGE_BUCKET = 'events';

/**
 * Upload an event poster image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<{url: string|null, error: Error|null}>} - The image URL or error
 */
export const uploadEventPoster = async (file) => {
  try {
    if (!file) {
      return { url: null, error: new Error('No file provided') };
    }
    
    // Create a unique filename using timestamp and random string
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `poster_${timestamp}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    
    // Upload directly to the bucket root (no folders)
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error details:', error);
      return { url: null, error };
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);
    
    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading poster:', error);
    return { url: null, error };
  }
};

/**
 * Delete an event poster from Supabase Storage
 * @param {string} url - The URL of the poster to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteEventPoster = async (url) => {
  try {
    if (!url) {
      return { success: false, error: new Error('No URL provided') };
    }
    
    // Extract the filename from the URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // Delete the file
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);
    
    if (error) {
      console.error('Delete error:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting poster:', error);
    return { success: false, error };
  }
};

/**
 * Check if the storage bucket exists and test permissions
 * @returns {Promise<{exists: boolean, error: Error|null, details: string|null}>}
 */
export const checkStorageAccess = async () => {
  try {
    // First check if we can list buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      return { 
        exists: false, 
        error: listError, 
        details: `Error listing buckets: ${listError.message}` 
      };
    }
    
    console.log('Available buckets:', buckets);
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === STORAGE_BUCKET);
    if (!bucketExists) {
      return { 
        exists: false, 
        error: new Error(`Bucket '${STORAGE_BUCKET}' not found`),
        details: `Available buckets: ${buckets.map(b => b.name).join(', ')}` 
      };
    }
    
    // Test if we can list files (to check permissions)
    const { data: files, error: filesError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list();
    
    if (filesError) {
      return { 
        exists: true, 
        error: filesError,
        details: `Bucket exists but cannot list files: ${filesError.message}` 
      };
    }
    
    return { 
      exists: true, 
      error: null,
      details: `Bucket '${STORAGE_BUCKET}' accessible, contains ${files.length} files` 
    };
  } catch (error) {
    console.error('Error checking storage access:', error);
    return { 
      exists: false, 
      error,
      details: `Unexpected error: ${error.message}` 
    };
  }
};

export default {
  uploadEventPoster,
  deleteEventPoster,
  checkStorageAccess,
  STORAGE_BUCKET
};