import {InspectorState} from "@/renderer/types/InspectorState";
import {writable, Writable} from "svelte/store";
import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

export const currentInspectorStateStore: Writable<InspectorState> = writable<InspectorState>(INSPECTOR_STATE_PRESETS.IDLE);

export function updateCurrentInspectorState(inspectorState: InspectorState): void {
    currentInspectorStateStore.update(current => current === inspectorState ? inspectorState : INSPECTOR_STATE_PRESETS.IDLE);
}