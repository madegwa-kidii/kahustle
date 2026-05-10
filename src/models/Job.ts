import { Schema, model, models, Types, Document } from "mongoose"

export interface IJob extends Document {
    _id: Types.ObjectId
    name: string
    description: string
    price: number
    userId: Types.ObjectId
    images: string[]
    status: "active" | "inactive"
    views: number
    createdAt: Date
    updatedAt: Date
    // Job-specific fields
    jobTitle: string
    company: string
    industry: string
    employmentType: "full-time" | "part-time" | "contract" | "temporary"
    location: string
    remote: boolean
    salaryMin: number
    salaryMax: number
    currency: string
    responsibilities: string[]
    qualifications: string[]
    benefits: string[]
    deadline?: Date
}

const JobSchema = new Schema<IJob>(
    {
        name: {
            type: String,
            required: [true, "Job posting name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
            default: "",
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        // Job-specific fields
        jobTitle: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            index: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            index: true,
        },
        industry: {
            type: String,
            required: [true, "Industry is required"],
            trim: true,
        },
        employmentType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "temporary"],
            required: [true, "Employment type is required"],
            index: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            index: true,
        },
        remote: {
            type: Boolean,
            default: false,
        },
        salaryMin: {
            type: Number,
            required: [true, "Minimum salary is required"],
            min: [0, "Salary cannot be negative"],
        },
        salaryMax: {
            type: Number,
            required: [true, "Maximum salary is required"],
            min: [0, "Salary cannot be negative"],
        },
        currency: {
            type: String,
            default: "USD",
            trim: true,
        },
        responsibilities: {
            type: [String],
            default: [],
        },
        qualifications: {
            type: [String],
            default: [],
        },
        benefits: {
            type: [String],
            default: [],
        },
        deadline: {
            type: Date,
            sparse: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
)

// Compound indexes for common queries
JobSchema.index({ userId: 1, status: 1 })
JobSchema.index({ company: 1, status: 1 })
JobSchema.index({ jobTitle: 1, status: 1 })
JobSchema.index({ employmentType: 1, status: 1 })
JobSchema.index({ createdAt: -1 })

export const Job = models.Job || model<IJob>("Job", JobSchema)
