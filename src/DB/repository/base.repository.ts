import { ProjectionType, PopulateOptions, UpdateQuery, QueryOptions, QueryFilter, HydratedDocument, Model, Types } from "mongoose";

export abstract class BaseRepository<TDocument> {

    constructor(protected readonly model: Model<TDocument>) {}

    async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
        return this.model.create(data);
    }

    async findById(id: Types.ObjectId): Promise<HydratedDocument<TDocument> | null> {
        return this.model.findById(id);
    }

    async findOne({
        filter,
        options,
        projection
    }: {
        filter: QueryFilter<TDocument>,
        projection?: ProjectionType<TDocument>,
        options?: QueryOptions<TDocument>
    }): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findOne(filter, projection)
            .populate(options?.populate as PopulateOptions | PopulateOptions[])
            .select(options?.select as ProjectionType<TDocument>)
            .sort(options?.sort)
            .exec();
    }

    async find({
        filter,
        options
    }: {
        filter?: QueryFilter<TDocument>,
        options?: QueryOptions<TDocument>
    } = {}): Promise<HydratedDocument<TDocument>[] | []> {
        let cursor = this.model.find(filter);

        if (options?.populate) {
            cursor = cursor.populate(options.populate as PopulateOptions | PopulateOptions[]);
        }
        if (options?.select) {
            cursor = cursor.select(options.select);
        }
        if (options?.sort) {
            cursor = cursor.sort(options.sort);
        }
        if (options?.limit) {
            cursor = cursor.limit(options.limit);
        }

        return cursor;
    }
}