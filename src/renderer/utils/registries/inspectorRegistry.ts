import {ContentType} from "@/renderer/enums/ContentType";
import {InspectorAction} from "@/renderer/enums/InspectorAction";
import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
import {Component} from "svelte";
import Idle from "@/renderer/components/inspector/Idle.svelte";

type ContentComponentMapping = Record<ContentType, Partial<Record<InspectorAction, Component<any>>>>;
type SpecialContentComponentMapping = Record<SpecialContentType, Component<any>>;

interface I_InspectorRegistry {
    'idle': Component<any>;
    'content': Partial<ContentComponentMapping>;
    'special-content': Partial<SpecialContentComponentMapping>;
}

export const INSPECTOR_REGISTRY: I_InspectorRegistry = {
    'idle': Idle,
    'content': {
        [ContentType.Entry]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: null as unknown as Component<any>,
            [InspectorAction.UPDATE]: null as unknown as Component<any>,
        },
        [ContentType.GrammaticalClass]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: null as unknown as Component<any>,
            [InspectorAction.UPDATE]: null as unknown as Component<any>,
        },
        [ContentType.GrammaticalGenre]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: null as unknown as Component<any>,
            [InspectorAction.UPDATE]: null as unknown as Component<any>,
        },
        [ContentType.Language]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: null as unknown as Component<any>,
            [InspectorAction.UPDATE]: null as unknown as Component<any>,
        }
    },
    'special-content': {
        [SpecialContentType.Help]: null as unknown as Component<any>,
        [SpecialContentType.Settings]: null as unknown as Component<any>,
    }
}