import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Artwork title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Artwork category is required'],
      trim: true,
      default: 'Sacred Deities',
    },
    image: {
      type: String,
      required: [true, 'Image path or URL is required'],
      trim: true,
    },
    medium: {
      type: String,
      trim: true,
      default: 'In-Situ Handcrafted Cement Relief',
    },
    dimensions: {
      type: String,
      trim: true,
      default: 'Custom Architectural Feature',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    highlights: {
      type: [String],
      default: ['Direct wall relief carving', 'Master architectural craftsmanship'],
    },
    featured: {
      type: Boolean,
      default: true,
    },
    aspect: {
      type: String,
      enum: ['portrait', 'landscape', 'square'],
      default: 'portrait',
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    // Metrics tracked for VPS 4GB disk optimization
    originalSize: {
      type: Number,
      default: 0,
    },
    compressedSize: {
      type: Number,
      default: 0,
    },
    compressionRatio: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id property
artworkSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

artworkSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const Artwork = mongoose.model('Artwork', artworkSchema);
