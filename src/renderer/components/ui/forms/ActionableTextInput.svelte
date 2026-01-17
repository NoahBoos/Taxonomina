<script lang="ts">
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import {Component} from "svelte";

    interface Props {
        name: string;
        label: string;
        placeholder: string;
        value: string | number;
        icon: Component;
        onClick: () => void;
    }

    let { name, label, placeholder, value = $bindable(''), icon, onClick }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-primary-300 bg-base-20;
    }
</style>

<div class="form-field-container flex flex-col gap-2 justify-center">
    <label for={ id }>{ label }</label>
    <div class="flex flex-row gap-2">
        <input type="text" { id } { name } { placeholder } bind:value={ value } class="w-full" />
        <IconButton { icon } { onClick } />
    </div>
</div>