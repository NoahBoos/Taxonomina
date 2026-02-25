<script lang="ts">
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";

    interface Props {
        dictionary_id: number;
        selected_grammatical_genres: I_GrammaticalGenre[];
    }

    let { dictionary_id, selected_grammatical_genres = $bindable([]) }: Props = $props();

    let available_genres = $state<I_GrammaticalGenre[]>([]);

    $effect(() => {
        GrammaticalGenreService.readAll(dictionary_id).then(data => {
            available_genres = data.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

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
</script>

<style>

</style>

<div class="form-field-container space-y-2">
    <p class="font-bold">Genres grammaticaux</p>
    {#if available_genres.length > 0}
        <div class="grid grid-cols-2 gap-1">
            {#each available_genres as grammatical_genre}
                <Checkbox name={ 'gg-' + grammatical_genre.id } label={ grammatical_genre.name } checked={ isChecked(grammatical_genre) } onChange={ () => toggle(grammatical_genre) } variant="minimal" />
            {/each}
        </div>
    {:else}
        <p>Aucun genre grammatical n'a pu être récupéré.</p>
    {/if}
</div>