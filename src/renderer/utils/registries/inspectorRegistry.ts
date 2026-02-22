import {ContentType} from "@/renderer/enums/ContentType";
import {InspectorAction} from "@/renderer/enums/InspectorAction";
import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
import {Component} from "svelte";
import Idle from "@/renderer/components/inspector/Idle.svelte";
import LanguageForm from "@/renderer/components/features/language/LanguageForm.svelte";
import GrammaticalClassForm from "@/renderer/components/features/grammatical_class/GrammaticalClassForm.svelte";
import GrammaticalGenreForm from "@/renderer/components/features/grammatical_genre/GrammaticalGenreForm.svelte";
import EntryForm from "@/renderer/components/features/entry/EntryForm.svelte";
import SettingsPage from "@/renderer/components/features/settings/SettingsPage.svelte";
import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
import EntryReadOne from "@/renderer/components/features/entry/EntryReadOne.svelte";

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
            [InspectorAction.READ_ONE]: EntryReadOne,
            [InspectorAction.CREATE]: EntryForm,
            [InspectorAction.UPDATE]: EntryForm,
        },
        [ContentType.GrammaticalClass]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: GrammaticalClassForm,
            [InspectorAction.UPDATE]: GrammaticalClassForm,
        },
        [ContentType.GrammaticalGenre]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: GrammaticalGenreForm,
            [InspectorAction.UPDATE]: GrammaticalGenreForm,
        },
        [ContentType.Language]: {
            [InspectorAction.READ_ONE]: null as unknown as Component<any>,
            [InspectorAction.CREATE]: LanguageForm,
            [InspectorAction.UPDATE]: LanguageForm,
        }
    },
    'special-content': {
        [SpecialContentType.Help]: null as unknown as Component<any>,
        [SpecialContentType.Settings]: SettingsPage,
    }
}

export const SPECIAL_CONTENT_INSPECTOR_STATES: Record<SpecialContentType, any> = {
    [SpecialContentType.Help]: INSPECTOR_STATE_PRESETS.SPECIAL_CONTENT.HELP,
    [SpecialContentType.Settings]: INSPECTOR_STATE_PRESETS.SPECIAL_CONTENT.SETTINGS
}