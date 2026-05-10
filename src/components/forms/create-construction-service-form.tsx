"use client"

import { useState, memo } from "react"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface CreateConstructionServiceFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
}

export const CreateConstructionServiceForm = memo(function CreateConstructionServiceForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreateConstructionServiceFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        serviceType: "",
        expertise: [] as string[],
        expertiseInput: "",
        yearsOfExperience: "",
        license: "",
        insurance: false,
        availability: "",
        serviceArea: [] as string[],
        serviceAreaInput: "",
        priceType: "",
        certifications: [] as string[],
        certificationInput: "",
        previousProjects: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddItem = (type: "expertise" | "serviceArea" | "certifications") => {
        const inputField = `${type}Input` as keyof typeof formData
        const inputValue = formData[inputField] as string

        if (inputValue.trim()) {
            setFormData((prev) => ({
                ...prev,
                [type]: [...prev[type], inputValue.trim()],
                [inputField]: "",
            }))
        }
    }

    const handleRemoveItem = (type: "expertise" | "serviceArea" | "certifications", index: number) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "serviceType", "yearsOfExperience", "availability", "priceType"]
        if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
            return
        }

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            serviceType: formData.serviceType,
            expertise: formData.expertise,
            yearsOfExperience: parseInt(formData.yearsOfExperience),
            license: formData.license || undefined,
            insurance: formData.insurance,
            availability: formData.availability,
            serviceArea: formData.serviceArea,
            priceType: formData.priceType,
            certifications: formData.certifications,
            previousProjects: formData.previousProjects ? parseInt(formData.previousProjects) : undefined,
            images: [],
        })

        // Reset form
        setFormData({
            name: "",
            description: "",
            price: "",
            serviceType: "",
            expertise: [],
            expertiseInput: "",
            yearsOfExperience: "",
            license: "",
            insurance: false,
            availability: "",
            serviceArea: [],
            serviceAreaInput: "",
            priceType: "",
            certifications: [],
            certificationInput: "",
            previousProjects: "",
        })
        onOpenChange(false)
    }

    const isFormValid =
        formData.name &&
        formData.price &&
        formData.serviceType &&
        formData.yearsOfExperience &&
        formData.availability &&
        formData.priceType

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Construction Service</DialogTitle>
                    <DialogDescription>Enter your service details and credentials</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <Label htmlFor="name">Service Name *</Label>
                        <Input
                            id="name"
                            placeholder="Professional Roofing Services"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your services and experience..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="serviceType">Service Type *</Label>
                            <Input
                                id="serviceType"
                                placeholder="Roofing"
                                value={formData.serviceType}
                                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                            <Input
                                id="yearsOfExperience"
                                type="number"
                                placeholder="10"
                                value={formData.yearsOfExperience}
                                onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="priceType">Price Type *</Label>
                            <Select value={formData.priceType} onValueChange={(value) => handleInputChange("priceType", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="negotiable">Negotiable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="availability">Availability *</Label>
                            <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="immediately">Immediately</SelectItem>
                                    <SelectItem value="within-2-weeks">Within 2 Weeks</SelectItem>
                                    <SelectItem value="within-month">Within a Month</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="license">License</Label>
                            <Input
                                id="license"
                                placeholder="License number"
                                value={formData.license}
                                onChange={(e) => handleInputChange("license", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-end">
                            <Label htmlFor="insurance" className="text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        id="insurance"
                                        type="checkbox"
                                        checked={formData.insurance}
                                        onChange={(e) => handleInputChange("insurance", e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    Has Insurance
                                </div>
                            </Label>
                        </div>
                        <div>
                            <Label htmlFor="previousProjects">Previous Projects</Label>
                            <Input
                                id="previousProjects"
                                type="number"
                                placeholder="100"
                                value={formData.previousProjects}
                                onChange={(e) => handleInputChange("previousProjects", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Expertise Areas</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Residential Roofing"
                                value={formData.expertiseInput}
                                onChange={(e) => handleInputChange("expertiseInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("expertise")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("expertise")}
                                disabled={isLoading || !formData.expertiseInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.expertise.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("expertise", index)}
                                            className="hover:opacity-70"
                                            type="button"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Service Areas</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Manhattan"
                                value={formData.serviceAreaInput}
                                onChange={(e) => handleInputChange("serviceAreaInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("serviceArea")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("serviceArea")}
                                disabled={isLoading || !formData.serviceAreaInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.serviceArea.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.serviceArea.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("serviceArea", index)}
                                            className="hover:opacity-70"
                                            type="button"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Certifications</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., OSHA Certified"
                                value={formData.certificationInput}
                                onChange={(e) => handleInputChange("certificationInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("certifications")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("certifications")}
                                disabled={isLoading || !formData.certificationInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.certifications.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("certifications", index)}
                                            className="hover:opacity-70"
                                            type="button"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !isFormValid}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Listing"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
