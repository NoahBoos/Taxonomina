import {ContentType} from "@/renderer/enums/ContentType";
import {InspectorAction} from "@/renderer/enums/InspectorAction";
import {SpecialContentType} from "@/renderer/enums/SpecialContentType";

export type InspectorState =
    | {
        category: 'idle';
    }
    | {
        category: 'content';
        type: ContentType;
        action: InspectorAction;
        id?: number;
    }
    | {
        category: 'special-content';
        type: SpecialContentType;
    };
