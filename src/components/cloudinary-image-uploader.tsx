"use client"

import { useState, useCallback } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CloudinaryImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function CloudinaryImageUploader({
  onImagesChange,
  maxImages = 3,
  disabled = false,
}: CloudinaryImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files
      if (!files) return

      setUploadError(null)

      // Check total count
      const remainingSlots = maxImages - images.length
      if (files.length > remainingSlots) {
        setUploadError(`You can only upload ${remainingSlots} more image(s)`)
        return
      }

      setUploading(true)

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Upload failed")
          }

          const data = await response.json()
          if (!data.success) {
            throw new Error(data.error || "Upload failed")
          }

          return data.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
      } catch (error) {
        console.error("[v0] Upload error:", error)
        setUploadError("Failed to upload image(s). Please try again.")
      } finally {
        setUploading(false)
      }

      // Reset input
      e.currentTarget.value = ""
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
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {uploadError}
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
