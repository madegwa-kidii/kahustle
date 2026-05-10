"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CloudinaryImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export function CloudinaryImageUploader({
  onImagesChange,
  maxImages = 3,
  disabled = false,
}: CloudinaryImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type: ${file.name}. Only PNG, JPG, GIF, and WebP are allowed.`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name}. Maximum size is 5MB.`
    }
    return null
  }

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget?.files
      if (!files || files.length === 0) {
        console.log("[v0] No files selected")
        return
      }

      console.log("[v0] Files selected:", files.length)
      setUploadError(null)

      // Validate file count
      const remainingSlots = maxImages - images.length
      if (files.length > remainingSlots) {
        const errorMsg = `You can only upload ${remainingSlots} more image(s)`
        console.warn("[v0] File count error:", errorMsg)
        setUploadError(errorMsg)
        return
      }

      // Validate each file
      const fileArray = Array.from(files)
      for (const file of fileArray) {
        const validationError = validateFile(file)
        if (validationError) {
          console.warn("[v0] Validation error:", validationError)
          setUploadError(validationError)
          // Reset input after error
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
          return
        }
      }

      setUploading(true)
      console.log("[v0] Starting upload for", fileArray.length, "file(s)")

      try {
        const uploadPromises = fileArray.map(async (file) => {
          console.log("[v0] Uploading file:", file.name)
          
          const formData = new FormData()
          formData.append("file", file)

          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            })

            console.log("[v0] Upload response status:", response.status)

            if (!response.ok) {
              const errorText = await response.text()
              console.error("[v0] Upload HTTP error:", response.status, errorText)
              throw new Error(`Upload failed with status ${response.status}`)
            }

            const data = await response.json()
            console.log("[v0] Upload response data:", { success: data.success, hasUrl: !!data.url })

            if (!data.success) {
              console.error("[v0] Upload not successful:", data.error)
              throw new Error(data.error || "Upload failed")
            }

            if (!data.url) {
              console.error("[v0] No URL in response")
              throw new Error("No URL returned from upload")
            }

            return data.url
          } catch (error) {
            console.error("[v0] File upload error:", file.name, error)
            throw error
          }
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        console.log("[v0] All files uploaded successfully:", uploadedUrls.length)

        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
        
        console.log("[v0] Images state updated. Total images:", newImages.length)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        console.error("[v0] Upload error:", errorMessage)
        setUploadError(`Failed to upload image(s): ${errorMessage}`)
      } finally {
        setUploading(false)
        // Reset input after upload (success or failure)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
          console.log("[v0] Input cleared")
        }
      }
    },
    [images, maxImages, onImagesChange]
  )

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      onImagesChange(newImages)
    },
    [images, onImagesChange]
  )

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">
          Images <span className="text-muted-foreground">({images.length}/{maxImages})</span>
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          Upload up to {maxImages} images to showcase your listing
        </p>
      </div>

      {/* Upload area */}
      {canAddMore && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || disabled}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Upload failed</p>
            <p className="text-xs mt-1">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-20 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
