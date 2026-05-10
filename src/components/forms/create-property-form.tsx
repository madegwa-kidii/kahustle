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

interface CreatePropertyFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
}

export const CreatePropertyForm = memo(function CreatePropertyForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreatePropertyFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        amenities: [] as string[],
        amenityInput: "",
        yearBuilt: "",
        parking: "street",
        condition: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddAmenity = () => {
        if (formData.amenityInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, prev.amenityInput.trim()],
                amenityInput: "",
            }))
        }
    }

    const handleRemoveAmenity = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "propertyType", "bedrooms", "bathrooms", "squareFeet", "address", "city", "state", "postalCode", "condition"]
        if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
            return
        }

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            propertyType: formData.propertyType,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseFloat(formData.bathrooms),
            squareFeet: parseFloat(formData.squareFeet),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            amenities: formData.amenities,
            yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
            parking: formData.parking,
            condition: formData.condition,
            images: [],
        })

        // Reset form
        setFormData({
            name: "",
            description: "",
            price: "",
            propertyType: "",
            bedrooms: "",
            bathrooms: "",
            squareFeet: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            amenities: [],
            amenityInput: "",
            yearBuilt: "",
            parking: "street",
            condition: "",
        })
        onOpenChange(false)
    }

    const isFormValid = formData.name && formData.price && formData.propertyType && formData.bedrooms && formData.bathrooms && formData.squareFeet && formData.address && formData.city && formData.state && formData.postalCode && formData.condition

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Property Listing</DialogTitle>
                    <DialogDescription>Enter property details and specifications</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <Label htmlFor="name">Property Name/Title *</Label>
                        <Input
                            id="name"
                            placeholder="Beautiful Apartment in Downtown"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Additional details about the property..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="propertyType">Property Type *</Label>
                            <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="residential">Residential</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="land">Land</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="condition">Condition *</Label>
                            <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="excellent">Excellent</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="bedrooms">Bedrooms *</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                placeholder="3"
                                value={formData.bedrooms}
                                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="bathrooms">Bathrooms *</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                step="0.5"
                                placeholder="2"
                                value={formData.bathrooms}
                                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="squareFeet">Square Feet *</Label>
                            <Input
                                id="squareFeet"
                                type="number"
                                placeholder="2000"
                                value={formData.squareFeet}
                                onChange={(e) => handleInputChange("squareFeet", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                            id="address"
                            placeholder="123 Main Street"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                placeholder="NY"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                                id="postalCode"
                                placeholder="10001"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="parking">Parking</Label>
                            <Select value={formData.parking} onValueChange={(value) => handleInputChange("parking", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parking" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="street">Street</SelectItem>
                                    <SelectItem value="garage">Garage</SelectItem>
                                    <SelectItem value="lot">Lot</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="yearBuilt">Year Built (Optional)</Label>
                            <Input
                                id="yearBuilt"
                                type="number"
                                placeholder="2000"
                                value={formData.yearBuilt}
                                onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
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

                    <div>
                        <Label>Amenities</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Pool, Gym, Parking"
                                value={formData.amenityInput}
                                onChange={(e) => handleInputChange("amenityInput", e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddAmenity()
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button
                                variant="outline"
                                onClick={handleAddAmenity}
                                disabled={isLoading || !formData.amenityInput.trim()}
                                type="button"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.amenities.map((amenity, index) => (
                                    <div key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-sm">{amenity}</span>
                                        <button
                                            onClick={() => handleRemoveAmenity(index)}
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
