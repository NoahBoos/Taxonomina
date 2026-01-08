import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
import {InspectorAction} from "@/renderer/enums/InspectorAction";
import {ContentType} from "@/renderer/enums/ContentType";
import {InspectorState} from "@/renderer/types/InspectorState";

export const INSPECTOR_STATE_PRESETS = {
    IDLE: {
        category: 'idle'
    } as const,
    CONTENT: {
        ENTRY: {
            READ_ONE: (id: number): InspectorState => ({
                category: 'content',
                type: ContentType.Entry,
                action: InspectorAction.READ_ONE,
                id: id
            }),
            CREATE: {
                category: 'content',
                type: ContentType.Entry,
                action: InspectorAction.CREATE
            } as const,
            UPDATE: (id: number): InspectorState =>( {
                category: 'content',
                type: ContentType.Entry,
                action: InspectorAction.UPDATE,
                id: 0
            })
        },
        GRAMMATICAL_CLASS: {
            READ_ONE: (id: number): InspectorState => ({
                category: 'content',
                type: ContentType.GrammaticalClass,
                action: InspectorAction.READ_ONE,
                id: id
            }),
            CREATE: {
                category: 'content',
                type: ContentType.GrammaticalClass,
                action: InspectorAction.CREATE
            } as const,
            UPDATE: (id: number): InspectorState =>( {
                category: 'content',
                type: ContentType.GrammaticalClass,
                action: InspectorAction.UPDATE,
                id: 0
            })
        },
        GRAMMATICAL_GENRE: {
            READ_ONE: (id: number): InspectorState => ({
                category: 'content',
                type: ContentType.GrammaticalGenre,
                action: InspectorAction.READ_ONE,
                id: id
            }),
            CREATE: {
                category: 'content',
                type: ContentType.GrammaticalGenre,
                action: InspectorAction.CREATE
            } as const,
            UPDATE: (id: number): InspectorState =>( {
                category: 'content',
                type: ContentType.GrammaticalGenre,
                action: InspectorAction.UPDATE,
                id: 0
            })
        },
        LANGUAGE: {
            READ_ONE: (id: number): InspectorState => ({
                category: 'content',
                type: ContentType.Language,
                action: InspectorAction.READ_ONE,
                id: id
            }),
            CREATE: {
                category: 'content',
                type: ContentType.Language,
                action: InspectorAction.CREATE
            } as const,
            UPDATE: (id: number): InspectorState =>( {
                category: 'content',
                type: ContentType.Language,
                action: InspectorAction.UPDATE,
                id: 0
            })
        }
    },
    SPECIAL_CONTENT: {
        HELP: {
            category: 'special-content',
            type: SpecialContentType.Help
        } as const,
        SETTINGS: {
            category: 'special-content',
            type: SpecialContentType.Settings
        } as const
    }
};