"use client";

import { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiTrash2, FiFile, FiImage, FiVideo, FiMoreVertical, FiExternalLink } from "react-icons/fi";
import { GlassCard } from "@/components/ui/GlassCard";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

const FREE_TIER_LIMIT_BYTES = 500 * 1024 * 1024; // 500 MB

export function PersonalVault() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadFiles();
  }, [user]);

  const loadFiles = async () => {
    try {
      const q = query(
        collection(db, "users", user.uid, "vault"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFiles(docs);
      
      const sumBytes = docs.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
      setTotalBytes(sumBytes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vault files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      toast.error("Cloudinary not configured. Check .env.local");
      return;
    }

    let sumNewBytes = 0;
    for (const f of selectedFiles) sumNewBytes += f.size;

    if (totalBytes + sumNewBytes > FREE_TIER_LIMIT_BYTES) {
      toast.error("Upload exceeds your 500MB Free limit. Please upgrade to Pro.");
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of selectedFiles) {
      try {
        const result = await uploadToCloudinary(file);
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, "users", user.uid, "vault"), {
          name: result.name,
          url: result.url,
          publicId: result.publicId,
          resourceType: result.resourceType,
          format: result.format,
          sizeBytes: result.bytes,
          createdAt: serverTimestamp(),
        });

        setFiles(prev => [{
          id: docRef.id,
          name: result.name,
          url: result.url,
          resourceType: result.resourceType,
          sizeBytes: result.bytes, // <-- NOTE changed bytes
          createdAt: new Date(),
        }, ...prev]);
        
        setTotalBytes(prev => prev + result.bytes);
        successCount++;
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file(s) to vault`);
    }
  };

  const handleDelete = async (file) => {
    if (!confirm("Delete this file permanently?")) return;
    
    try {
      await deleteDoc(doc(db, "users", user.uid, "vault", file.id));
      setFiles(prev => prev.filter(f => f.id !== file.id));
      setTotalBytes(prev => Math.max(0, prev - (file.sizeBytes || 0)));
      toast.success("File deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (resourceType, format) => {
    if (resourceType === "image") return <FiImage className="text-blue-400" />;
    if (resourceType === "video") return <FiVideo className="text-purple-400" />;
    return <FiFile className="text-zinc-400" />;
  };

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono">Personal Vault</h2>
          <p className="text-sm text-zinc-400 mt-1">Free cloud storage backed by Cloudinary</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-zinc-300">{formatSize(totalBytes)} / 500 MB</p>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full ${totalBytes > FREE_TIER_LIMIT_BYTES * 0.9 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min((totalBytes / FREE_TIER_LIMIT_BYTES) * 100, 100)}%` }} 
              />
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || totalBytes >= FREE_TIER_LIMIT_BYTES}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiUploadCloud />
            )}
            <span>Upload</span>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          multiple 
          className="hidden" 
        />
      </div>

      {totalBytes >= FREE_TIER_LIMIT_BYTES && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-red-400">Storage Limit Reached</h4>
            <p className="text-sm text-zinc-400">You've reached your free 500MB limit. Upgrade to Pro for 10GB.</p>
          </div>
          <Link href="/pro" className="whitespace-nowrap px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors">
            Upgrade Plan
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <FiUploadCloud className="mx-auto text-4xl text-zinc-500 mb-4" />
          <h3 className="text-lg font-medium mb-1">Your vault is empty</h3>
          <p className="text-zinc-400 text-sm mb-6">Upload files, images, or notes to keep them safe</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors"
          >
            Select Files
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map(file => (
            <div key={file.id} className="group relative flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                {file.resourceType === "image" ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-xl">{getFileIcon(file.resourceType, file.format)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-zinc-500">{formatSize(file.sizeBytes)} • {file.format?.toUpperCase()}</p>
              </div>

              {/* Hover Actions */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-xl">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-300 hover:text-white"
                  title="Open file"
                >
                  <FiExternalLink />
                </a>
                <button 
                  onClick={() => handleDelete(file)}
                  className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-red-400 hover:text-red-300"
                  title="Delete file"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
