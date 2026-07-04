import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { Document, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

export type BrandDoc = Brand & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name || '', { replacement: '-', trim: true, lower: true });
    },
  })
  slug: string;

  @Prop({ type: String, required: true })
  logo: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const updateData = this.getUpdate() as UpdateQuery<BrandDoc>;
  
  if (updateData?.name) {
    updateData.slug = slugify(updateData.name as string, {
      replacement: '-',
      trim: true,
      lower: true,
    });
  }
  next();
});

export const BrandFeatureDefinition = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);