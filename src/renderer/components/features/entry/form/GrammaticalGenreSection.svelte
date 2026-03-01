<script lang="ts">
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";
    import { lockedFieldValuesStore } from "@/renderer/stores/lockedFieldValuesStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { LockOpen, Lock } from "@lucide/svelte";

    interface Props {
        dictionary_id: number;
        selected_grammatical_genres: I_GrammaticalGenre[];
        is_lockable?: boolean;
    }

    let { dictionary_id, selected_grammatical_genres = $bindable([]), is_lockable = false }: Props = $props();

    let available_genres = $state<I_GrammaticalGenre[]>([]);

    function toggle(target: I_GrammaticalGenre) {
        const isAlreadySelected = selected_grammatical_genres.some(item => item.id === target.id);

        if (isAlreadySelected) {
            selected_grammatical_genres = selected_grammatical_genres.filter(item => item.id !== target.id);
        } else {
            selected_grammatical_genres.push(target);
        }
    }

    function isChecked(target: I_GrammaticalGenre) {
        return selected_grammatical_genres.some(item => item.id === target.id);
    }

    let is_locked = $state(false);

    function toggleLock() {
        if (is_locked) {
            lockedFieldValuesStore.update((current) => {
                const { ['grammatical-genres']: _removed, ...rest } = current;
                return rest;
            });
            is_locked = false;
        } else {
            if (selected_grammatical_genres.length === 0) return;
            const snapshot = $state.snapshot(selected_grammatical_genres);
            lockedFieldValuesStore.update((current) => ({ ...current, ['grammatical-genres']: snapshot }));
            is_locked = true;
        }
    }

    $effect(() => {
        GrammaticalGenreService.readAll(dictionary_id).then(data => {
            available_genres = data.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

    $effect(() => {
        if (!is_lockable) return;

        const lockedData = $lockedFieldValuesStore['grammatical-genres'] as I_GrammaticalGenre[] | undefined;

        is_locked = !!lockedData;

        if (!is_locked) return;
        if (!lockedData) return;
        if (selected_grammatical_genres.length !== 0) return;

        selected_grammatical_genres = lockedData.map((gg) => gg);
    });
</script>

<style>

</style>

<div class="form-field-container space-y-2">
    <div class="flex flex-row justify-between items-center">
        <p class="font-bold">Genres grammaticaux</p>
        {#if is_lockable}
            <IconButton icon={ is_locked ? LockOpen : Lock } text={ is_locked ? 'Déverrouiller' : 'Verrouiller' } variant={ is_locked ? 'active' : 'default' } onClick={ toggleLock } />
        {/if}
    </div>
    {#if available_genres.length > 0}
        <div class="grid grid-cols-4 gap-1">
            {#each available_genres as grammatical_genre}
                <Checkbox name={ 'gg-' + grammatical_genre.id } label={ grammatical_genre.name } checked={ isChecked(grammatical_genre) } onChange={ () => toggle(grammatical_genre) } variant="minimal" disabled={ is_locked } />
            {/each}
        </div>
    {:else}
        <p>Aucun genre grammatical n'a pu être récupéré.</p>
    {/if}
</div>