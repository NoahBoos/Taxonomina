<script lang="ts">
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import {Component} from "svelte";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    interface Props {
        name: string;
        label: string;
        placeholder: string;
        value: string | number;
        icon: Component;
        onClick: () => void;
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { name, label, placeholder, value = $bindable(''), icon, onClick, errors = [] }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="form-field-container flex flex-col gap-2 justify-center { errors.length > 0 ? 'form-field-container--errors' : '' }">
    <label for={ id }>{ label }</label>
    <div class="flex flex-row gap-2">
        <input type="text" { id } { name } { placeholder } bind:value={ value } class="w-full" />
        <IconButton { icon } { onClick } />
    </div>
    {#if errors.length > 0}
        <div>
            {#each errors as error}
                <p>{ error.code } : { error.message }</p>
            {/each}
        </div>
    {/if}
</div>