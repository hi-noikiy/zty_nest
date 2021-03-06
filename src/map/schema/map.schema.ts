import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
    strict: false
})


export class Map extends Document {

    @Prop({
        unique: true
    })
    mapName: string;

    @Prop()
    isActive: boolean;

    @Prop()
    layerCount: number;

}

export const MapSchema = SchemaFactory.createForClass(Map);

