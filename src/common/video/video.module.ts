import { Module } from "@nestjs/common";
import { VideoGateway } from "./video.gateway";


@Module({
    imports:[],
    providers: [VideoGateway],
    exports: [VideoGateway]
})

export class VideoModule{}