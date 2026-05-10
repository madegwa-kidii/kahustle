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

interface CreateJobFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
}

export const CreateJobForm = memo(function CreateJobForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreateJobFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        jobTitle: "",
        company: "",
        industry: "",
        employmentType: "",
        location: "",
        remote: false,
        salaryMin: "",
        salaryMax: "",
        currency: "USD",
        responsibilities: [] as string[],
        responsibilityInput: "",
        qualifications: [] as string[],
        qualificationInput: "",
        benefits: [] as string[],
        benefitInput: "",
        deadline: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddItem = (type: "responsibilities" | "qualifications" | "benefits") => {
        const inputField = `${type.slice(0, -1)}Input` as keyof typeof formData
        const inputValue = formData[inputField] as string

        if (inputValue.trim()) {
            setFormData((prev) => ({
                ...prev,
                [type]: [...prev[type], inputValue.trim()],
                [inputField]: "",
            }))
        }
    }

    const handleRemoveItem = (type: "responsibilities" | "qualifications" | "benefits", index: number) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "jobTitle", "company", "industry", "employmentType", "location", "salaryMin", "salaryMax"]
        if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
            return
        }

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            jobTitle: formData.jobTitle,
            company: formData.company,
            industry: formData.industry,
            employmentType: formData.employmentType,
            location: formData.location,
            remote: formData.remote,
            salaryMin: parseFloat(formData.salaryMin),
            salaryMax: parseFloat(formData.salaryMax),
            currency: formData.currency,
            responsibilities: formData.responsibilities,
            qualifications: formData.qualifications,
            benefits: formData.benefits,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
            images: [],
        })

        // Reset form
        setFormData({
            name: "",
            description: "",
            price: "",
            jobTitle: "",
            company: "",
            industry: "",
            employmentType: "",
            location: "",
            remote: false,
            salaryMin: "",
            salaryMax: "",
            currency: "USD",
            responsibilities: [],
            responsibilityInput: "",
            qualifications: [],
            qualificationInput: "",
            benefits: [],
            benefitInput: "",
            deadline: "",
        })
        onOpenChange(false)
    }

    const isFormValid =
        formData.name &&
        formData.price &&
        formData.jobTitle &&
        formData.company &&
        formData.industry &&
        formData.employmentType &&
        formData.location &&
        formData.salaryMin &&
        formData.salaryMax

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Job Listing</DialogTitle>
                    <DialogDescription>Enter job details and requirements</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <Label htmlFor="name">Job Posting Name/Title *</Label>
                        <Input
                            id="name"
                            placeholder="Senior Software Engineer Position"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Job description..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="jobTitle">Job Title *</Label>
                            <Input
                                id="jobTitle"
                                placeholder="Senior Software Engineer"
                                value={formData.jobTitle}
                                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                placeholder="Tech Company"
                                value={formData.company}
                                onChange={(e) => handleInputChange("company", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="industry">Industry *</Label>
                            <Input
                                id="industry"
                                placeholder="Technology"
                                value={formData.industry}
                                onChange={(e) => handleInputChange("industry", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="employmentType">Employment Type *</Label>
                            <Select value={formData.employmentType} onValueChange={(value) => handleInputChange("employmentType", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="part-time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="temporary">Temporary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                placeholder="New York, NY"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label htmlFor="remote" className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="remote"
                                            type="checkbox"
                                            checked={formData.remote}
                                            onChange={(e) => handleInputChange("remote", e.target.checked)}
                                            disabled={isLoading}
                                        />
                                        Remote Available
                                    </div>
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="salaryMin">Min Salary *</Label>
                            <Input
                                id="salaryMin"
                                type="number"
                                placeholder="50000"
                                value={formData.salaryMin}
                                onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="salaryMax">Max Salary *</Label>
                            <Input
                                id="salaryMax"
                                type="number"
                                placeholder="100000"
                                value={formData.salaryMax}
                                onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                placeholder="USD"
                                value={formData.currency}
                                onChange={(e) => handleInputChange("currency", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Position ID/Code *</Label>
                            <Input
                                id="price"
                                placeholder="POS-001"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="deadline">Application Deadline (Optional)</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => handleInputChange("deadline", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label>Responsibilities</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add responsibility..."
                                value={formData.responsibilityInput}
                                onChange={(e) => handleInputChange("responsibilityInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("responsibilities")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("responsibilities")}
                                disabled={isLoading || !formData.responsibilityInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.responsibilities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.responsibilities.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("responsibilities", index)}
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
                        <Label>Qualifications</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add qualification..."
                                value={formData.qualificationInput}
                                onChange={(e) => handleInputChange("qualificationInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("qualifications")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("qualifications")}
                                disabled={isLoading || !formData.qualificationInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.qualifications.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.qualifications.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("qualifications", index)}
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
                        <Label>Benefits</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add benefit..."
                                value={formData.benefitInput}
                                onChange={(e) => handleInputChange("benefitInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddItem("benefits")
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddItem("benefits")}
                                disabled={isLoading || !formData.benefitInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.benefits.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.benefits.map((item, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem("benefits", index)}
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
