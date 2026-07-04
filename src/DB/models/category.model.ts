import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

export type CategoryDocument = HydratedDocument<Category>;

const generateSlug = (text: string): string => {
  return text ? slugify(text, { replacement: '-', trim: true, lower: true }) : '';
};

const schemaConfig = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
};

@Schema(schemaConfig)
export class Category {
  @Prop({ 
    type: String, 
    required: true, 
    minlength: 3, 
    trim: true, 
    unique: true 
  })
  name: string;

  @Prop({
    type: String,
    default: function (this: Category) {
      return generateSlug(this.name);
    },
  })
  slug: string;

  @Prop({ type: String, required: false })
  image?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  updatedBy?: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const updatePayload = this.getUpdate() as UpdateQuery<CategoryDocument>;

  if (updatePayload?.name) {
    updatePayload.slug = generateSlug(updatePayload.name as string);
  }
  
  next();
});

export const CategoryFeature = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);